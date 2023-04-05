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
                
                //let cellText = "some other text" 
                //how do I find occurrences of queryText within cellText? 
                    //google search string matching 
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

    //FILTER DATE
    //slice: https://www.w3schools.com/js/js_string_methods.asp
    // data.forEach ( function (d) {
    //     let rawText = d.Date;
    //     let newText = [];

    //     for (let i = 0; i < ____; i++) {
    //         if (position = n.d.) {
    //             //discard;
    //         } else {
    //             //take 4 right characters
    //         }
        
    //     let queryText = 'item'; 

    //     d.Text = newText; 

    // console.log(d.Date); 
    // })


    // COUNT NUMBER OF OCCURANCES FOR EACH MEDIUM 
    var dataset = d.Medium;
    var search = acrylic; 
    var count = dataset.reduce(function(n, val) {
        return n+ (val === search); 
    }, 0); 

    console.log(count); 

    //or another version:
    // https://www.freecodecamp.org/news/how-to-count-objects-in-an-array/
    const storage = d.Medium
    let counter = acrylic; 
    for (let i = acrylic; i < storage.length; i++) {
        if (storage[i].status === 'acrylic') counter++; 
    }

    console.log(counter); 



    /*    3. DETERMINE MIN AND MAX VALUES OF VARIABLES  */
    const Date = {
        min: d3.min(filtered_data, function(d) { return +d.Date; }),
        max: d3.max(filtered_data, function(d) { return +d.Date; })
    };
    // console.log(Date.min);

    const Medium = {
        min: d3.min(filtered_data, function(d) { return +d.Medium; }),
        max: d3.max(filtered_data, function(d) { return +d.Medium; })
    };
    // console.log(Medium.min); 



    // /*
    // 4. CREATE SCALES
    //     Please refer to these nice explanations/tutorials: 
    //         https://medium.com/@mbostock/introducing-d3-scale-61980c51545f
    //         https://jckr.github.io/blog/2011/08/11/d3-scales-and-color/

    //     - What does d3.scaleSqrt() do?

    //     This function creates a square-root based scale by transforming a given
    //     domain so that values in that domain are proportional to their square root.
    //     If a value `x` is 4 times bigger than value `a`, then the result is only
    //     multiplied by 2 the square root of 4. 
    //     See this demonstration: https://observablehq.com/@d3/continuous-scales#scale_sqrt

    //     - What does d3.scaleOrdinal() do?

    //     This function maps two finite sets made up of
    //     discrete "things" in a one-by-one fashion. It takes
    //     categorical domain consisting of continent names and
    //     maps them into color values.
    //     See this demonstration: https://observablehq.com/@d3/d3-scaleordinal

    //     xScale: The domain and range are uncountable.
    //     yScale: The domain and range are uncountable.
    //     rScale: The domain and range are uncountable.
    //     fillScale: The domain and range are finite sets, each one
    //     consisting of five values.

    // */

    // const margin = {top: 50, left: 100, right: 50, bottom: 100};

    // const xScale = d3.scaleLinear()
    //     .domain([Year.min, Year.max])
    //     .range([margin.left, width-margin.right]);

    // const yScale = d3.scaleLinear()
    //     .domain([0, Medium.max])
    //     .range([height-margin.bottom, margin.top]);

    // const rScale = d3.scaleSqrt()
    //     .domain([pop.min, pop.max])
    //     .range([1, 15]);

    // const fillScale = d3.scaleOrdinal()
    //     .domain(["acrylic","charcoal","collage","colored pencil","crayon","glass","gouache","graphite","ink","lithograph","paint","pen","pencil","print","steel","wood"])
    //     .range(['#E5D08C','#F2E7CD','#BC9D44','#C2B5AD','#7C6458','#B99A6D','#C38B64','#8F5138','#762F21','#6C914D','#78856E','#6C948A','#3B658D','#79647B','#AC626E','#EAAA9B']);


    // /*    5. DRAW AXES    */
    // const xAxis = svg.append("g")
    //     .attr("class","axis")
    //     .attr("transform", `translate(0,${height-margin.bottom})`)
    //     .call(d3.axisBottom().scale(xScale));

    // const yAxis = svg.append("g")
    //     .attr("class","axis")
    //     .attr("transform", `translate(${margin.left},0)`)
    //     .call(d3.axisLeft().scale(yScale));


    // /*    6. DRAW POINTS
    // The following chunk of code is the standard D3 data join pattern.
    //     - What is the purpose of the pattern svg.selectAll().data().enter().append()?

    //     This is a standard pattern for joining data with D3. 
    //     The purpose of this pattern is to JOIN data with DOM elements, 
    //     such as SVG basic shapes (e.g., rect). The pattern starts with
    //     .selectALl() that selects all the currently existing shapes and
    //     binds them with the provided dataset using .data(). Then,
    //     you use .enter() to check what ADDITIONAL shapes you must
    //     create/append to complete the binding. For example, if you
    //     have NO SHAPES of the type "rect" in the beginning, then
    //     .enter().append("rect") will append as many rectangles as
    //     needed to bind all the data points in your dataset. If you have
    //     1 "rect" and 3 data points, then it will append 2 missing
    //     "rect" shapes to complete the binding. Essentially, .enter()
    //     tells you which data points are missing a corresponding DOM
    //     element.  */

    // const points = svg.selectAll("circle")
    //     .data(filtered_data)
    //     .enter()
    //     .append("circle")
    //         .attr("cx", function(d) { return xScale(d.Year); })
    //         .attr("cy", function(d) { return yScale(d.lifeExp); })
    //         .attr("r", function(d) { return rScale(d.pop); })
    //         .attr("fill", function(d) { return fillScale(d.continent); });
    
    // /*    7. DRAW AXIS LABELS   */

    // const xAxisLabel = svg.append("text")
    //     .attr("class","axisLabel")
    //     .attr("x", width/2)
    //     .attr("y", height-margin.bottom/2)
    //     .text("Year");

    // const yAxisLabel = svg.append("text")
    //     .attr("class","axisLabel")
    //     .attr("transform","rotate(-90)")
    //     .attr("x",-height/2)
    //     .attr("y",margin.left/2)
    //     .text("Quantity");


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

    // });