### Commitizen
<pre>
npm install commitizen -g
commitizen init cz-conventional-changelog --save-dev --save-exact
git add .
git cz
---

npm i --save-dev standard-version
add to your package.json

  "scripts": {
    "release": "standard-version"
  },

npm run release
</pre>
