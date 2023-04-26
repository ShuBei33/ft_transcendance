# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: estoffel <estoffel@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2023/04/26 16:41:45 by estoffel          #+#    #+#              #
#    Updated: 2023/04/26 16:47:38 by estoffel         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

COMPOSE	= docker-compose -f ./srcs/docker-compose.yml

all:
	make build
	make up

help:
		@echo "\n"
		@echo "---------------------------------------------------------------------------------"
		@echo "- make		  -> build the image from Dockerfile + create + start containers"
		@echo "- make build	  -> build the image from Dockerfile"
		@echo "- make up	  -> create + start containers"
		@echo "- make ps	  -> display containers state"
		@echo "- make ps logs	  -> display containers state + logs"
		@echo "- make start/stop -> start or stop containers"
		@echo "- make down	  -> stop and remove containers"
		@echo "- make restart	  -> stop + up"
		@echo "- make prune	  -> erase docker volumes"
		@echo "- make re	  -> down + prune + build + up\n"
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