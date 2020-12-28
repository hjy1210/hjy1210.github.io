window.MathJax = {
    loader: {
        load: ['input/tex','input/mml', 'output/chtml','[tex]/mhchem','[tex]/tagformat']
    },
    tex: {
        packages: {'[+]': ['tagformat']},
        tagSide: 'right',
        tags: 'ams',
        tagformat: {
            tag: (n) => '[' + n + ']'
        },
        macros: {
          RR: '{\\bf R}',
          bold: ['{\\bf #1}',1]
        }
    }
};

(function () {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/startup.js';
    script.async = true;
    document.head.appendChild(script);
})();