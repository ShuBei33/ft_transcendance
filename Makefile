# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ychibani <ychibani@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/04/26 16:41:45 by estoffel          #+#    #+#              #
#    Updated: 2023/04/28 14:18:37 by ychibani         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

COMPOSE	= docker-compose -f ./srcs/docker-compose.yml

_END=$'\e[0m
_BOLD=$'\e[1m
_UNDER=$'\e[4m
_REV=$'\e[7m
_GREY=$'\e[30m
_RED=$'\e[0;31m
_GREEN=$'\e[32m
_YELLOW=$'\e[33m
_BLUE=$'\e[34m
_PURPLE=$'\e[35m
_CYAN=$'\e[36m
_WHITE=$'\e[37m

_IGREY=$'\e[40m
_IRED=$'\e[41m
_IGREEN=$'\e[42m
_IYELLOW=$'\e[43m
_IBLUE=$'\e[44m
_IPURPLE=$'\e[45m
_ICYAN=$'\e[46m
_IWHITE=$'\e[47m


all:
	make build
	make up

help:
		@echo "\n"
		@echo "---------------------------------------------------------------------------------"
		@echo "-${_PURPLE} make		  ${_END}-> build the image from Dockerfile + create + start containers"
		@echo "-${_PURPLE} make build ${_END}-> build the image from Dockerfile"
		@echo "-${_PURPLE} make up	 ${_END} -> create + start containers"
		@echo "-${_PURPLE} make ps	 ${_END} -> display containers state"
		@echo "-${_PURPLE} make ps logs	  ${_END}-> display containers state + logs"
		@echo "-${_PURPLE} make start/stop ${_END}-> start or stop containers"
		@echo "-${_PURPLE} make down	  ${_END}-> stop and remove containers"
		@echo "-${_PURPLE} make restart	  ${_END}-> stop + up"
		@echo "-${_PURPLE} make prune	  ${_END}-> erase docker volumes"
		@echo "-${_PURPLE} make re	  ${_END}-> down + prune + build + up\n"
		@echo "---------------------------------------------------------------------------------\n"

build:
	$(COMPOSE) build
#build the image from Dockerfile

up:
	$(COMPOSE) up -d
#create and start containers

start:
	$(COMPOSE) start
#start all the containers

ps logs:
	$(COMPOSE) $@

down:
	$(COMPOSE) down
#stop and remove containers

stop:
	$(COMPOSE) stop
#stop the containers

restart: stop build up

prune:
	docker volume prune --force

re: down prune build up

.PHONY: build up start ps logs down stop restart prune re