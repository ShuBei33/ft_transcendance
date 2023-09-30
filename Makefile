
# --  Color   -- #
_CYAN  = \033[36m
_GREEN = \033[32m
_RED   = \033[31m
_ENDL  = \033[0m

DB_NAME= db

.PHONY: all
all:
	@docker-compose up --build -d
	@echo "$(_GREEN) Docker Container was created $(_ENDL)"

.PHONY: no-detach
no-detach:
	@docker-compose up --build
	@echo "$(_GREEN) Docker Container was created $(_ENDL)"

.PHONY: re
re: fclean all

.PHONY: clean
clean:
	@docker-compose stop
	@echo "$(_GREEN) Docker Container was stopped $(_ENDL)"

.PHONY: fclean
fclean: clean
	@docker system prune -af
	@echo "$(_GREEN) Docker Container was removed $(_ENDL)"


# SHORTCUT 
# - vous permez de rentrer dans votre container.
# - utile pour faire les installations de packages.

.PHONY: enter-file_service
enter-file_service:
	@echo "$(_CYAN) You $(_GREEN)entered$(_CYAN) the FileService container $(_ENDL)"
	@docker exec -it file_service sh
	@echo "$(_CYAN) You $(_RED)exited$(_CYAN) the FileService container $(_ENDL)"

.PHONY: enter-back
enter-back:
	@echo "$(_CYAN) You $(_GREEN)entered$(_CYAN) the BackEnd container $(_ENDL)"
	@docker exec -it back sh
	@echo "$(_CYAN) You $(_RED)exited$(_CYAN) the BackEnd container $(_ENDL)"

.PHONY: enter-db
enter-db:
	@echo "$(_CYAN) You $(_GREEN)entered$(_CYAN) the DB container $(_ENDL)"
	@docker exec -it ${DB_NAME} sh
	@echo "$(_CYAN) You $(_RED)exited$(_CYAN) the BDD container $(_ENDL)"

.PHONY: enter-front
enter-front:
	@echo "$(_CYAN) You $(_GREEN)entered$(_CYAN) the FrontEnd container $(_ENDL)"
	@docker exec -it front sh
	@echo "$(_CYAN) You $(_RED)exited$(_CYAN) the FrontEnd container $(_ENDL)"


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


