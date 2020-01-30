module.exports = {
    '*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint', 'git add'],
    '*.{json}': ['prettier --write', 'git add'],
    '*.css': 'stylelint --syntax css',
    // '*.{png,jpeg,jpg,gif,svg}': ['imagemin-lint-staged', 'git add'],
};
