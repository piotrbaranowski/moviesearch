# Movie search

This is simple app to search some movies using [OMDb API](http://www.omdbapi.com/)

## Using
1. Install [Node.js.](https://nodejs.org/en/)
1. Clone this repository running `git clone https://github.com/piotrbaranowski/moviesearch.git`.
1. Run command `npm install` inside main directory.
1. Run `REACT_APP_OMDB_API_KEY=<OMDb API key> npm start`,
   remember to replace `<OMDb API key>` with your [OMDb API key](http://www.omdbapi.com/apikey.aspx).
1. Go to [http://localhost:3000/](http://localhost:3000/) in your favourite browser and enjoy.

## Additional comments from author

As requested in exercise description I mostly focused on providing good UI
and UX, with technical solutions to support it.

## UI/UX
* Simple, clean, functional look
* Self-explanatory
* Responsive, works with wide range of screen sizes
* Query stored in url - it is not lost after page refresh
* Simple but advanced search input - it just works!
    * Debounce
    * Request cancelling when query changed
    * Autofocus - just start typing after initial page load
    * "Smart" - automatically parses year in query
    * Interactive - It reacts on hover and focus
* Good feedback for user
    * Loader when movies are fetched from server
    * Info when there is no results
    * Info when there is no poster

### What's next?
* animations when showing/hiding results, more fluent UX.
* movie type interpretation from query, like "series"
* query trimming from whitespaces
* improvements in interpretation year from query
* extending API with fuzzy search
* extending API with more search capabilities, other than title, year and type

## Features
* searching in movie db by year and title
* displaying posters and basic movie data

### What's next?
* An infinite scroll for more results
* Movie view with more details

## technical
Simple React application, fontAwesome for icons, tests where most needed.

### What's next?
* Better solution for communication with API
* add some variables in SCSS
