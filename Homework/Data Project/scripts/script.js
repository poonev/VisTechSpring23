d3.csv("./data/artworks.csv").then(function(data) {

    /*    1. DEFINE DIMENSIONS OF SVG + CREATE SVG CANVAS   */
    const width = document.querySelector("#chart").clientWidth;
    const height = document.querySelector("#chart").clientHeight;
    //If chart doesn't draw, might have to change this to clientinnerwidth and height

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    //FILTERING MEDIUM
    let filtered_data = data.filter(function(d) {
        return d.Name === 'Ludwig Mies van der Rohe';
    });

    let arrayKeywords = ["acrylic","charcoal","collage","colored pencil","crayon","glass","gouache","graphite","ink","lithograph","paint","pen","pencil","print","steel","wood"]; 

    data.forEach ( function (d) {
        //search in the cell of the data point 'd' (a text),
        //for every cell (for loop), 
            //define your cellText in which you search our occurrences 
        let rawText = d.Medium;
        let newText = [];
            
        for (let i = 0; i < arrayKeywords.length; i++) {
            let position = rawText.search(arrayKeywords[i]);  
            if (position != -1) {
                newText += " " + arrayKeywords[i];
                //implement if more than 1 word, + ", "
                }
            }
        //for every item in arrayKeywords (for loop over arrayKeywords), 
                // define my queryText= "some text" 
        let queryText = 'item'; 
                //if you find occurrence of 'item' then define newText = 'item'
                    //subset of arrayKeywords
                //if you find occurrence of queryText in cellText, then: 
                    //append queryText in newText array
            //replace d.medium with contents of newText
            //newText is not a text (i.e., string) but an array. So you replace d.medium with the contents of newText, not newText itself. 
        d.Medium = newText;
        // let newText = "search in the cell for occurrences of keywords" 
    // console.log(d.Medium); 
    })

    // COUNT OCCURANCES 
    const mediumData = []; 
    data.forEach( function(currentrow) {
        // console.log(currentrow["Medium"]); 
        var currentMediums = currentrow["Medium"]
        // var newLine = {}
        for (let i = 0; i < arrayKeywords.length; i++) {
            let position = currentMediums.indexOf(arrayKeywords[i]);  
            if (position != -1) {
                // newLine[arrayKeywords[i]] = 1
                var newLine = {}
                newLine["Year"] = currentrow["Date"]
                newLine["Medium"] = arrayKeywords[i]
                mediumData.push(newLine)
                }
            }
        // newLine["Year"] = currentrow["Date"]
        // mediumData.push(newLine)
    })

    const finalData = d3.rollup(mediumData, d=>d.length, d=>d.Year, d=>d.Medium)
    console.log(finalData); 

    for(let obj of finalData.entries()) {

    }


    /*    3. MIN AND MAX VALUES OF VARIABLES  */
    const Date = {
        min: d3.min(finalData, function(d) { return +d.Date; }),
        max: d3.max(finalData, function(d) { return +d.Date; })
    };
    // console.log(Date.min);

    const Medium = {
        min: d3.min(finalData, function(d) { return +d.value; }),
        max: d3.max(finalData, function(d) { return +d.value; })
    };
    console.log(finalData.min); 

    /*  4. CREATE SCALES
        Please refer to these nice explanations/tutorials: 
            https://medium.com/@mbostock/introducing-d3-scale-61980c51545f
            https://jckr.github.io/blog/2011/08/11/d3-scales-and-color/

        - What does d3.scaleSqrt() do?
        This function creates a square-root based scale by transforming a given
        domain so that values in that domain are proportional to their square root.
        If a value `x` is 4 times bigger than value `a`, then the result is only
        multiplied by 2 the square root of 4. 
        See this demonstration: https://observablehq.com/@d3/continuous-scales#scale_sqrt

        - What does d3.scaleOrdinal() do?
        This function maps two finite sets made up of
        discrete "things" in a one-by-one fashion. It takes
        categorical domain consisting of continent names and
        maps them into color values.
        See this demonstration: https://observablehq.com/@d3/d3-scaleordinal

        xScale: The domain and range are uncountable.
        yScale: The domain and range are uncountable.
        rScale: The domain and range are uncountable.
        fillScale: The domain and range are finite sets, each one
        consisting of five values.  */

    const margin = {top: 50, left: 100, right: 50, bottom: 100};

    const xScale = d3.scaleLinear()
        .domain([1910, 1969])
        .range([margin.left, width-margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, finalData.max])
        .range([height-margin.bottom, margin.top]);

    const rScale = d3.scaleSqrt()
        .domain([1, finalData.max])
        .range([1, 15]);

    const fillScale = d3.scaleOrdinal()
        .domain(["acrylic","charcoal","collage","colored pencil","crayon","glass","gouache","graphite","ink","lithograph","paint","pen","pencil","print","steel","wood"])
        .range(['#E5D08C','#F2E7CD','#BC9D44','#C2B5AD','#7C6458','#B99A6D','#C38B64','#8F5138','#762F21','#6C914D','#78856E','#6C948A','#3B658D','#79647B','#AC626E','#EAAA9B']);


    /*    5. DRAW AXES    */
    const xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));

    const yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));


    // /*    6. DRAW POINTS
    const points = svg.selectAll("circle")
        .data(finalData)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.Year); })
            .attr("cy", function(d) { 
                    // console.log(d.value)
                    return yScale(d.value); })
            .attr("r", function(d) { return rScale(d.value); })
            .attr("fill", function(d) { return fillScale(d.Medium); });
    
    // /*    7. DRAW AXIS LABELS   */

    const xAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("x", width/2)
        .attr("y", height-margin.bottom/2)
        .text("Year");

    const yAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("transform","rotate(-90)")
        .attr("x",-height/2)
        .attr("y",margin.left/2)
        .text("Quantity per Medium");


    //     /*   TOOLTIP Interactivity Implementation   */

    // points.on("mouseover", function(e, d) {

    //     // Update style and position of the tooltip div;
    //     // what are the `+` symbols doing?

    //     // You may increase/decrease the relative position 
    //     // of the tooltip by adding small +- values (e.g., +20, -10). 
    //     // Note, the tooltip's origin is its top-left point.

    //     let x = +d3.select(this).attr("cx") + 10;
    //     let y = +d3.select(this).attr("cy") + 20;

    //     // Format the display of the numbers,
    //     // using d3.format()
    //     // See: https://github.com/d3/d3-format/blob/v3.1.0/README.md#format

    //     let displayValue = d3.format(",")(d.pop);
        
    //     // Make the tooltip visible when mouse "enters" a point
    //     tooltip.style("visibility", "visible")
    //         .style("top", `${y}px`)
    //         .style("left", `${x}px`)
    //         // This is just standard HTML syntax
    //         .html(`<p><b>${d.country}</b><br><em>${d.continent}</em><br>#: ${displayValue}</p>`);

    //     // Optionally, visually highlight the selected circle
    //     points.attr("opacity", 0.1);
    //     d3.select(this)
    //         .attr("opacity", 1)
    //         .style("stroke", "black")
    //         .style("stroke-width", "1px")
    //         // this makes the selected circle "pop out" and stand over the rest of the circles
    //         .raise();

    // }).on("mouseout", function() {

    //     // Make the tooltip invisible when mouse "leaves" a point
    //     tooltip.style("visibility", "hidden");

    //     // Reset the circles' appearance back to original
    //     points.attr("opacity", 1);

    });