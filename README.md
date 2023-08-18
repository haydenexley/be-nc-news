# Hayden's News API

## Built at Northcoders

[View here!](https://haydens-news.onrender.com/)

# Summary

This is an API designed during project week for the Northcoders backend project. This is a backend service designed for creating, commenting on and editing news articles.

# How to's

Below is a guide on how to use the repo yourself.

## Cloning

In order to clone this repo get the clone url at the top of the page by clicking the green 'code' button then copying the Local HTTPS url.
Use your terminal to find the directory on your machine that you would like to clone into then type `git clone <url>`.

## Install Dependencies

To install all dependencies, after opening your file in vscode, run `npm install`.

## Seed Local Database

In order to seed the local database, in the terminal run `npm run seed`

## Run Tests

To run tests on the application, in the terminal run the command `npm test app` or to test the whole appication just run `npm test`, this will also run the tests for utility functions.

## .env files

Two .env files are required to run the development and test database locally, these should be set up in the main folder structure and are named `.env.development` and `.env.test`. After creating these set the text inside development to `PGDATABASE=nc_news` and `PGDATABASE=nc_news_test` for the test env file.

## Minimum versions

The versions used in this project for node.js and Postgres are `v17.9.1.` and `v15.3` respectively.
