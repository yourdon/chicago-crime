Chicago Crime and Goodhart's Law
=================================

Herewith, a brief example of "damned lies and statistics," based on work by [Chicago Magazine](http://www.chicagomag.com/Chicago-Magazine/May-2014/Chicago-crime-rates/).  Data munged with Python and visualized with d3.js and friends. 

Running
-------

1. Download the repo, and navigate to the main directory. 
2. From this directory, type: `python -m SimpleHTTPServer 8000`
3. In a browser, navigate to: `http://localhost:8000/`

The IPython notebook used to munge the original data can be found in the `data` directory and has the standard scientific library dependencies.

**Note**: The original dataset set is 1.25 GB and is not included here, but it can be downloaded through the [Chicago Data Portal](https://data.cityofchicago.org/). The (much smaller) summary dataset that d3 is accessing is included, however.