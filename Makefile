
# --  Color   -- #
_CYAN  = \033[36m
_GREEN = \033[32m
_RED   = \033[31m
_ENDL  = \033[0m

DB_NAME= db

.PHONY: all
all:
	@docker-compose up --build -d
	@echo "$(_GREEN) Docker Container was Created $(_ENDL)"

.PHONY: no-detach
no-detach:
	@docker-compose up --build
	@echo "$(_GREEN) Docker Container was Created $(_ENDL)"

.PHONY: re
re: fclean all

.PHONY: clean
clean:
	@docker-compose stop
	@echo "$(_GREEN) Docker Container was stoped $(_ENDL)"

.PHONY: fclean
fclean: clean
	@docker system prune -af
	@echo "$(_GREEN) Docker Container was removed $(_ENDL)"


# SHORTCUT 
# - vous permez de rentrer dans votre container.
# - utile pour faire les installations de packages.

.PHONY: enter-file_service
enter-file_service:
	@echo "$(_CYAN) Tu es $(_GREEN)Entrer$(_CYAN) dans le container du FileService $(_ENDL)"
	@docker exec -it file_service sh
	@echo "$(_CYAN) Tu es $(_RED)Sorti$(_CYAN) le container du FileService $(_ENDL)"

.PHONY: enter-back
enter-back:
	@echo "$(_CYAN) Tu es $(_GREEN)Entrer$(_CYAN) dans le container du BackEnd $(_ENDL)"
	@docker exec -it back sh
	@echo "$(_CYAN) Tu es $(_RED)Sorti$(_CYAN) le container du BackEnd $(_ENDL)"

.PHONY: enter-db
enter-db:
	@echo "$(_CYAN) Tu es $(_GREEN)Entrer$(_CYAN) dans le container de la BDD $(_ENDL)"
	@docker exec -it ${DB_NAME} sh
	@echo "$(_CYAN) Tu es $(_RED)Sorti$(_CYAN) le container de la BDD $(_ENDL)"

.PHONY: enter-front
enter-front:
	@echo "$(_CYAN) Tu es $(_GREEN)Entrer$(_CYAN) dans le container du FrontEnd $(_ENDL)"
	@docker exec -it front sh
	@echo "$(_CYAN) Tu es $(_RED)Sorti$(_CYAN) le container du FrontEnd $(_ENDL)"


# SHORTCUT 
# - vous permez d'afficher les logs d'un container.
# - utile les tests preliminaire et debug.

.PHONY: log-back
log-back:
	@docker logs back -f

.PHONY: log-file_service
log-file_service:
	@docker logs file_service -f

.PHONY: log-db
log-db:
	@docker logs ${DB_NAME} -f

.PHONY: log-front
log-front:
	@docker logs front -f

