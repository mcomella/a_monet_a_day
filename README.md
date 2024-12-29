# A Monet a Day
A website to display a different painting by Claude Monet each day.

The website is deployed using GitHub Pages from the `docs` directory.

## Developing
To run, host `docs` from a static file server, eg:
```sh
npm run host
```

Don't forget to set up the pre-push hook:
```sh
ln -s ../../scripts/pre-push.sh .git/hooks/pre-push
```

## Updating input data
Run:
```sh
node scripts/updateMonetPaintings.js
```

And commit the updates to version control.
