### Commitizen
<pre>
npm install commitizen -g
commitizen init cz-conventional-changelog --save-dev --save-exact
git add .
git cz
---

npm i --save-dev standard-version //
npm i -g standard-version

add to your package.json

  "scripts": {
    "release": "standard-version"
  },

standard-version
npm run release

# npm run script
npm run release -- --release-as minor
# Or
npm run release -- --release-as 1.1.0
</pre>

`feat`: introduces a new feature to the codebase (this correlates with a `MINOR` in SemVer es: 2.0.0 -> 2.1.0).
`fix`: a bugfix in your codebase (this correlates with a `PATCH` in semVer es: 2.0.0 -> 2.0.1).
`BREAKING CHANGE`: is a total change of your code, this is also can be used with a previous tag like BREAKING CHANGE: feat: <description> (this correlates with a MAJOR in SemVer es: 2.0.0 -> 3.0.0).
`docs`: a change in the README or documentation
`refactor`: a change in production code focused on upgrade code readability and style

https://github.com/commitizen/cz-cli
https://github.com/conventional-changelog/standard-version
