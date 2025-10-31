COMPOSE_FILE=docker-compose.yml

all: up

up:
	docker-compose -f $(COMPOSE_FILE) up -d

down:
	docker-compose -f $(COMPOSE_FILE) down

clean:
	docker-compose -f $(COMPOSE_FILE) down -v --rmi all

build:
	docker-compose -f $(COMPOSE_FILE) build

prune:
	docker system prune -a

clean-all:
	make clean
	make prune
