    function showlect() {
        //alert($(this).attr('class'));
        var index = $(this).parent().children().index(this);
        var x = $(".lect");
        var y = $(".lectbutton");
        for (i = 0; i < x.length; i++) {
            if (i == index) {
                //x[i].style.display = "block";
                $(x[i]).css('display', 'block');
                $(y[i]).removeClass('w3-white').addClass('w3-black');
            } else {
                $(x[i]).css('display', 'none');
                $(y[i]).removeClass('w3-black').addClass('w3-white');
            }
        }
    }

    $('.lectbutton').on('click', showlect);

 
    var values, x, index;
    var arr, n, replication, size, mu, sigma, samplemu, samplesigma, left, right;
    var xScale, sScale, xinverse, pScale, population, data, width, mar, height, maxy;

    function standard(x, mu, sigma) {
        return (x - mu) / sigma;
    }

    function relativefrequency(x) {
        var c = 0;
        for (var i = 0; i < values.length; i++) {
            if (values[i] <= x)
                c = c + 1;
            else
                break;
        }
        return c / values.length;
    }

    function showdiff(x) {
        d3.select('#upperlimit').text(x.toPrecision(4));
        d3.select('#aproxprob').text(jStat.normal.cdf(standard(x, samplemu, samplesigma), 0, 1).toPrecision(4));
        d3.select('#frequency').text(relativefrequency(x).toPrecision(4));
        var diff = (d3.select('#frequency').text() -
            d3.select('#aproxprob').text()).toPrecision(4);
        d3.select('#diff').text(diff);
        if (diff > 0)
            d3.select('#diff').style('color', 'blue');
        else
            d3.select('#diff').style('color', 'green');
    }

    function histo() {
        function part1_1() {
            n = parseInt(d3.select('#noOfPartition').node().value);
            replication = parseInt(d3.select('#replication').node().value);
            size = parseInt(d3.select('#samplesize').node().value);
            // <V1> <W1>,<V2> <W2>,...
            var pairs = d3.select('#population').node().value.split(',');
            population = [];
            var psum = 0;
            for (var i = 0; i < pairs.length; i++) {
                var temp = pairs[i].split(' ').filter(Boolean); // remove ""
                if (temp.length >= 2)
                    population.push({
                        v: temp[0],
                        p: parseFloat(temp[1])
                    });
                else
                    population.push({
                        v: temp[0],
                        p: 1
                    });
                psum = psum + population[i].p;
            }
            // normalize
            for (var i = 0; i < population.length; i++) population[i].p /= psum;
        }

        function part1_2() {
            values = [];
            for (var i = 0; i < replication; i++) {
                values.push(d3.mean(st.sample(population, size)));
            }
        }

        function part2() {
            values = values.sort(function(a, b) {
                return a - b;
            });
            left = d3.min(values) - 0.00001;
            right = d3.max(values) + 0.00001;

            var vcs = st.valueCount(values);
            data = st.countFrequency(vcs, left, right, n); //[{value:[],count[],total}, ...]
        }

        function part3() {
            mu = st.mean(population);
            sigma = st.sd(population);
            samplemu = mu;
            samplesigma = sigma / Math.sqrt(size);
            d3.select('#mu').text('' + mu.toPrecision(4));
            d3.select('#sigma').text('' + sigma.toPrecision(4));
            d3.select('#samplemu').text('' + samplemu.toPrecision(4));
            d3.select('#samplesigma').text('' + samplesigma.toPrecision(4));

            width = 600;
            height = 300;
            mar = {
                left: 60,
                top: 60,
                right: 60,
                bottom: 40
            };
            maxy = d3.max(data, function(d) {
                return d.total;
            });
        }

        function part4() {
            pScale = d3.scale.linear()
                .domain([0, 1])
                .range([height - mar.bottom, mar.top]);
            xScale = d3.scale.linear()
                .domain([left, right])
                .range([mar.left, width - mar.right]);
            xinverse = d3.scale.linear()
                .range([left, right])
                .domain([mar.left, width - mar.right]);
            sScale = d3.scale.linear()
                .domain([standard(left, samplemu, samplesigma),
                    standard(right, samplemu, samplesigma)
                ])
                .range([mar.left, width - mar.right]);
            var chart = d3.select(".chart")
                .attr("width", width)
                .attr("height", height);

            chart.selectAll("g").remove(); // clean chart

            var barWidth = (width - mar.left - mar.right) / data.length;
            if (barWidth < 0.5) barWidth = 0.5;
            var step = (right - left) / data.length;
            var bar = chart.selectAll("g")
                .data(data)
                .enter().append("g")
                .attr("transform", function(d, i) {
                    return "translate(" +
                        xScale(left + i * step) + ",0)";
                });

            // bar
            var bwinsd = (right - left) / n / samplesigma;
            bar.append("rect").attr('class', 'pdf')
                .style('visibility',
                    d3.select('input[name="plottype"]:checked').node().value == 'pdf' ? 'visible' : 'hidden')
                .attr("y", function(d) {
                    return pScale(d.total / values.length / bwinsd);
                })
                .attr("height", function(d) {
                    return height - mar.bottom -
                        pScale(d.total / values.length / bwinsd);
                })
                .attr("width", barWidth)
                .append('svg:title')
                .text(function(d) {
                    return d.tips;
                });
            // right label
            chart.append('g').append("text")
                .attr("text-anchor", "start").attr('class', 'pdf')
                .attr("x", 0).attr("y", 0).attr('transform', 'matrix(0,-1,1,0,' + (width - mar.right - 6) + ',' + height / 2 + ')')
                .style('visibility',
                    d3.select('input[name="plottype"]:checked').node().value == 'pdf' ? 'visible' : 'hidden')
                //.style('fill','white')
                //.style('font-size','14px')
                .text("次數");

            // right axis
            var fScale = d3.scale.linear()
                .domain([0, bwinsd * values.length])
                .range([height - mar.bottom, mar.top]);
            var fAxis = d3.svg.axis()
                .scale(fScale).orient('right');
            chart.append('g')
                .attr("class", "axis pdf")
                .style('visibility',
                    d3.select('input[name="plottype"]:checked').node().value == 'pdf' ? 'visible' : 'hidden')
                .attr('transform', 'translate(' + xScale(right) + ',' + (0) + ')')
                .call(fAxis);
            // limit pdf
            var pdfpoints = "";
            var step2 = (width - mar.left - mar.right) / 300;
            var multiplier = 1 / Math.sqrt(2 * Math.PI);
            for (var i = 0; i <= 300; i++) {
                var x0 = mar.left + i * step2;
                var s0 = standard(xinverse(x0), samplemu, samplesigma);
                pdfpoints = pdfpoints + x0 + ' ' +
                    (pScale(jStat.normal.pdf(s0, 0, 1)));
                if (i < 300) {
                    pdfpoints = pdfpoints + ',';
                }
            }
            chart.append('g').append('polyline').style('fill', 'none')
                .style('stroke', 'green').style('stroke-width', 2).attr('class', 'pdf')
                .style('visibility',
                    d3.select('input[name="plottype"]:checked').node().value == 'pdf' ? 'visible' : 'hidden')
                .attr('id', "standardpdf").style('opacity', '0.7')
                .attr('points', pdfpoints);
            // bottom label
            chart.append('g').append("text")
                .attr("text-anchor", "middle")
                .attr("x", width / 2).attr("y", height - 6)
                //.style('fill','white')
                //.style('font-size','14px')
                .html("量尺：母體原始資料");
            // bottom axis
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .orient('bottom');
            chart.append('g')
                .attr("class", "axis")
                .attr('transform', 'translate(' + 0 + ',' + (height - mar.bottom) + ')')
                .call(xAxis);
            // left label
            chart.append('g').append("text")
                .attr("text-anchor", "start").attr('class', 'cdf')
                .attr("x", 0).attr("y", 0).attr('transform', 'matrix(0,-1,1,0,20,' + height / 2 + ')')
                .style('visibility',
                    d3.select('input[name="plottype"]:checked').node().value == 'cdf' ? 'visible' : 'hidden')
                //.style('fill','white')
                //.style('font-size','14px')
                .text("機率");
            // left axis
            var pAxis = d3.svg.axis()
                .scale(pScale).orient('left');
            chart.append('g')
                .attr("class", "axis cdf")
                .style('visibility',
                    d3.select('input[name="plottype"]:checked').node().value == 'cdf' ? 'visible' : 'hidden')
                .attr('transform', 'translate(' + xScale(left) + ',' + (0) + ')')
                .call(pAxis);
            // top label
            chart.append('g').append("text")
                .attr("text-anchor", "middle")
                .attr("x", width / 2).attr("y", 20).attr('id', 'upperlabel')
                //.style('fill','white')
                //.style('font-size','14px')
                .html("量尺：樣本平均標準差為單位");
            //// http://stackoverflow.com/questions/15962325/mathjax-inside-svg
            // SVG 裡面要用MathJax，必須放在foreignObject裡，但不好看
            //chart.append('g').append("foreignObject")
            //  .attr("x",120).attr("y",0).attr('width','300').attr('height','60')
            //  .attr('id','upperlabel')
            //  .html("<div xmlns='http://www.w3.org/1999/xhtml' "+
            //    "style='font-family:sans-serif; font-size:16px'>"+
            //    "\\(\\displaystyle{量尺：樣本平均標準差"+
            //    "\\frac{\\sigma}{\\sqrt{n}}為單位}\\)</div>"); 
            //    //不用displaystyle,根號的底端被切掉
            var outputBox = d3.select('#upperlabel').node();
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, outputBox]);
            // top axis
            var sAxis = d3.svg.axis()
                .scale(sScale)
                .orient('top');
            chart.append('g')
                .attr("class", "axis")
                .attr('transform', 'translate(' + 0 + ',' + (mar.top) + ')')
                .call(sAxis);
            // limit cdf and empirical pdf
            var standardpoints = "";
            var experimentpoints = "";
            var step1 = (width - mar.left - mar.right) / 300;
            for (var i = 0; i <= 300; i++) {
                var x0 = mar.left + i * step1;
                var s0 = standard(xinverse(x0), samplemu, samplesigma);
                standardpoints = standardpoints + x0 + ' ' + pScale(jStat.normal.cdf(s0, 0, 1));
                if (i < 300) {
                    standardpoints = standardpoints + ',';
                }
            }
            var startvalue = values[0];
            experimentpoints = experimentpoints + xScale(startvalue) + ' ' + pScale(0) + ' ';
            experimentpoints = experimentpoints + xScale(startvalue) + ' ' + pScale(relativefrequency(startvalue)) + ' ';
            for (var i = 1; i < values.length; i++) {
                var x0 = values[i];
                if (x0 <= startvalue) continue;
                experimentpoints = experimentpoints + xScale(x0) + ' ' + pScale(relativefrequency(startvalue)) + ' ';
                startvalue = x0;
                experimentpoints = experimentpoints + xScale(startvalue) + ' ' + pScale(relativefrequency(startvalue)) + ' ';
            }
            chart.append('g').append('polyline').style('fill', 'none')
                .style('stroke', 'green').style('stroke-width', 2).attr('class', 'cdf')
                .style('visibility',
                    d3.select('input[name="plottype"]:checked').node().value == 'cdf' ? 'visible' : 'hidden')
                .attr('id', "standardcdf").style('opacity', '0.7')
                .attr('points', standardpoints);
            chart.append('g').append('polyline').style('fill', 'none')
                .style('stroke', 'blue').style('stroke-width', 2).attr('class', 'cdf')
                .style('visibility',
                    d3.select('input[name="plottype"]:checked').node().value == 'cdf' ? 'visible' : 'hidden')
                .attr('id', "experimentcdf").style('opacity', '0.7')
                .attr('points', experimentpoints);
            // setup upper limit with drag feature
            var drag = d3.behavior.drag()
                .on('drag', function(d, i) {
                    if (d3.event.x < mar.left) d3.event.x = mar.left;
                    if (d3.event.x > width - mar.rigth)
                        d3.event.x = width - mar.rigth;
                    d3.select(this).attr('cx', d3.event.x);
                    line.attr('x1', d3.event.x)
                        .attr('x2', d3.event.x);
                    x = xinverse(d3.event.x);
                    showdiff(x);
                });
            var cut = chart.append('g')
            cut.append('circle').attr('cx', sScale(0)).attr('cy', mar.top - 12)
                .attr('r', '12').attr('fill', 'red')
                .attr('opacity', '0.4')
                .attr('class', 'draggable')
                .call(drag);
            var line = cut.append('line').attr('x1', sScale(0)).attr('y1', mar.top)
                .attr('x2', sScale(0))
                .attr('y2', height - mar.bottom)
                .attr('stroke', 'red');
            showdiff(samplemu);
        }

        function part() {
            switch (index) {
                case 1:
                    part1_1();
                    progressbar.progressbar('value', 20);
                    break;
                case 2:
                    part1_2();
                    progressbar.progressbar('value', 40);
                    break;
                case 3:
                    part2();
                    progressbar.progressbar('value', 50);
                    break;
                case 4:
                    part3();
                    progressbar.progressbar('value', 80);
                    break;
                case 5:
                    part4();
                    progressbar.progressbar('value', 100);
                    break;
                default:
                    return;
            }
            index++;
            setTimeout(part, 100);
        }
        index = 1;
        setTimeout(part, 100);
    }

    function togglecdf() {
        if (d3.select('input[name="plottype"]:checked').node().value == 'cdf') {
            d3.selectAll('.cdf').each(function(d, i) {
                d3.select(this).style('visibility', 'visible');
            })
            d3.selectAll('.pdf').each(function(d, i) {
                d3.select(this).style('visibility', 'hidden');
            })
        } else {
            d3.selectAll('.cdf').each(function(d, i) {
                d3.select(this).style('visibility', 'hidden');
            })
            d3.selectAll('.pdf').each(function(d, i) {
                d3.select(this).style('visibility', 'visible');
            })
        }
    }
    var progressbar = $('#progressbar'),
        progressLabel = $('#progressLabel');
    progressbar.css('width', '100');

    function buttonfun() {
        n = parseInt(d3.select('#noOfPartition').node().value);
        if (!(n >= 10 && n <= 1000)) {
            alert('組數必須為10到1000間的整數');
            return;
        }
        replication = parseInt(d3.select('#replication').node().value);
        if (!(replication >= 10 && replication <= 10000)) {
            alert('m必須為10到10000間的整數');
            return;
        }
        size = parseInt(d3.select('#samplesize').node().value);
        if (!(size >= 1 && size <= 10000)) {
            alert('n必須為1到10000間的整數');
            return;
        }
        progressbar.progressbar({
            value: 0,
            change: function() {
                progressLabel.text(progressbar.progressbar("value") + "%");
            },
            complete: function() {
                progressLabel.text("模擬");
                progressbar.progressbar('destroy');
            }
        });
        progressbar.progressbar('value', 5);
        histo();
    }
