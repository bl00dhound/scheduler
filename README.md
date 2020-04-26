# scheduler

## Required

- Docker
- Node.js v10+

## Install

Create docker image with mongo DB and install npm-libraries.

```
make install
```

## Run

Run import file and create emails one by one.

```
make run-all file="<path_to_file>" delimiter="|"
```

Field `delimiter` is optional. By default "|" is used, but you can use any of symbols for parsing .csv, .tsv or any data files.

### Or

Run scripts separatly.
1. Import file to database.
	 ```
	make import-file file="<path_to_file>" delimiter="|"
	 ```
2. Create emails and schedule them for sending.
	 ```
	make schedule-emails
	 ```

For starting tests use `npm test` command.
You can find all logs in `./logs/output.log` file. I've created comments inside the code. Probably, they should help you to check.
