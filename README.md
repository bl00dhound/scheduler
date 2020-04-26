# scheduler

Import data from file and create email send schedule for them.

## Required

- Docker
- Node.js v10+

## Install

Create docker image with mongo DB and install npm-libraries.

```
make install
```

## Commands

There are three commands that provide all functionality:

1. Import file to database without create emails.
   ```
	 make import-file file="<path_to_file>" delimiter="|"
	 ```
	 Field `delimiter` is optionally. By default it uses "|", but you can use any of symbols for parsing .csv, .tsv or any symbol-separate files.
2. Create emails and schedule its according by patients on database.
	 ```
	 make schedule-emails
	 ```
3. Run import file and create emails together one by one.
   ```
	 make run-all file="<path_to_file>" delimiter="|"
	 ```

For starting tests use `npm test` command.
You can find all logs in `./logs/output.log` file. I've created a comments inside the code. Probably, it helps you to check.
