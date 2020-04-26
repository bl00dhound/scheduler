install:
	docker-compose up -d
	npm install
	cp .env.example .env

# command line syntax: make import-file file="data/data-file.dsv" delimiter="|"(optionally)
import-file:
	node index.js -i -d $(delimiter) -p $(file) 2>&1 | tee -a logs/output.log

schedule-emails:
	node index.js -s 2>&1 | tee -a logs/output.log

# command line syntax: make run-all file="data/data-file.dsv" delimiter="|"(optionally)
run-all:
	node index.js -i -s -p $(file) -d $(delimiter) 2>&1 | tee -a logs/output.log
