/*   1. DEFINE DIMENSIONS OF SVG + CREATE SVG CANVAS   */

const width = document.querySelector("#chart").clientWidth;
const height = document.querySelector("#chart").clientHeight;

const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

const tooltip = d3.select("#chart")
    .append("div")
    .attr("class", "tooltip");

let promise = [d3.csv("./data/mies filtered.csv")];


Promise.all(promise).then(function(results){
    drawScatterPlot(results[0]);
})

function drawScatterPlot(data) {

    /* 
    2. FILTER THE DATA 
    */
    let filtered_data = data.filter(function(d) {
        return d.artist === 'Ludwig Mies van der Rohe';
    });

    // //FILTERING MEDIUM
    // let filtered_data = data.filter(function(d) {
    //     return d.Name === 'Ludwig Mies van der Rohe';
    // });

    // let arrayKeywords = ["acrylic","charcoal","collage","colored pencil","crayon","glass","gouache","graphite","ink","lithograph","paint","pen","pencil","print","steel","wood"]; 

    // data.forEach ( function (d) {
    //     //search in the cell of the data point 'd' (a text),
    //     //for every cell (for loop), 
    //         //define your cellText in which you search our occurrences 
    //     let rawText = d.Medium;
    //     let newText = [];
            
    //     for (let i = 0; i < arrayKeywords.length; i++) {
    //         let position = rawText.search(arrayKeywords[i]);  
    //         if (position != -1) {
    //             newText += " " + arrayKeywords[i];
    //             //implement if more than 1 word, + ", "
    //             }
    //         }
    //     //for every item in arrayKeywords (for loop over arrayKeywords), 
    //             // define my queryText= "some text" 
    //     let queryText = 'item'; 
    //             //if you find occurrence of 'item' then define newText = 'item'
    //                 //subset of arrayKeywords
    //             //if you find occurrence of queryText in cellText, then: 
    //                 //append queryText in newText array
    //         //replace d.medium with contents of newText
    //         //newText is not a text (i.e., string) but an array. So you replace d.medium with the contents of newText, not newText itself. 
    //     d.Medium = newText;
    //     // let newText = "search in the cell for occurrences of keywords" 
    // // console.log(d.Medium); 
    // })

    // // COUNT OCCURANCES 
    // const mediumData = []; 
    // data.forEach( function(currentrow) {
    //     // console.log(currentrow["Medium"]); 
    //     var currentMediums = currentrow["Medium"]
    //     // var newLine = {}
    //     for (let i = 0; i < arrayKeywords.length; i++) {
    //         let position = currentMediums.indexOf(arrayKeywords[i]);  
    //         if (position != -1) {
    //             // newLine[arrayKeywords[i]] = 1
    //             var newLine = {}
    //             newLine["Year"] = currentrow["Date"]
    //             newLine["Medium"] = arrayKeywords[i]
    //             mediumData.push(newLine)
    //             }
    //         }
    //     // newLine["Year"] = currentrow["Date"]
    //     // mediumData.push(newLine)
    // })

    // const finalData = d3.rollup(mediumData, d=>d.length, d=>d.Year, d=>d.Medium)
    // console.log(finalData); 

    // for(let obj of finalData.entries()) {

    // }

    /*
    3. DETERMINE MIN AND MAX VALUES OF VARIABLES
    */

    const year = {
        min: d3.min(filtered_data, function(d) { return +d.year; }),
        max: d3.max(filtered_data, function(d) { return +d.year; })
    };
    // console.log(year.min)

    // const quantity = {
    //     min: d3.min(filtered_data, function(d) { return +d.quantity; }),
    //     max: d3.max(filtered_data, function(d) { return +d.quantity; })
    // };

    const quantity = {
        min: d3.min(filtered_data, function(d) { return +d.quantity; }),
        max: d3.max(filtered_data, function(d) { return +d.quantity; })
    };

    /*
    4. CREATE SCALES
    */

    const margin = {top: 50, left: 100, right: 50, bottom: 100};

    const xScale = d3.scaleLinear()
        .domain([1909, year.max])
        .range([margin.left, width-margin.right]);

    const yScale = d3.scaleLinear()
        .domain([0, quantity.max])
        .range([height-margin.bottom, margin.top]);

    const rScale = d3.scaleSqrt()
        .domain([quantity.min, quantity.max])
        .range([4, 30]);

    const fillScale = d3.scaleOrdinal()
    .domain(["acrylic","charcoal","collage","colored pencil","crayon","glass","gouache","graphite","ink","lithograph","paint","pen","pencil","print","steel","wood"])
    .range(['#E5D08C','#F2E7CD','#BC9D44','#C2B5AD','#7C6458','#B99A6D','#C38B64','#8F5138','#762F21','#6C914D','#78856E','#6C948A','#3B658D','#79647B','#AC626E','#EAAA9B']);


    /*   5. DRAW AXES   */

    const xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale).tickFormat(d => d.toLocaleString(undefined, { useGrouping: false })));

    const yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));
    
    /*     6. DRAW POINT  */

    const points = svg.selectAll("circle")
        .data(filtered_data)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return xScale(d.year);   })
            .attr("cy", function(d) { return yScale(d.quantity); })
            .attr("r", function(d) { return rScale(d.quantity); })
            .attr("fill", function(d) { return fillScale(d.medium); });

    /*   7. DRAW AXIS LABELS   */

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

    const otherText = svg.append("text")
        .attr("class", "chartText")
        .attr("x", width/2)
        .attr("y", margin.top)
        .text("");

    /*       TOOLTIP     */

    points.on("mouseover", function(e, d) {

        let x = +d3.select(this).attr("cx") + 10;
        let y = +d3.select(this).attr("cy") + 20;

        // Format the display of the numbers,
        // using d3.format()
        // See: https://github.com/d3/d3-format/blob/v3.1.0/README.md#format

        let displayValue = d3.format(",")(d.quantity);
        
        // Make the tooltip visible when mouse "enters" a point
        tooltip.style("visibility", "visible")
            .style("top", `${y}px`)
            .style("left", `${x}px`)
            // This is just standard HTML syntax
            .html(`<p><b>${d.year}</b><br><em>${d.medium}</em><br>total quantity: ${displayValue}<br><em>${d.notes}</em></p>`);

        // Optionally, visually highlight the selected circle
        points.attr("opacity", 0.1);
        d3.select(this)
            .attr("opacity", 1)
            .style("stroke", "gray")
            .style("stroke-width", "1px")
            // this makes the selected circle "pop out" and stand over the rest of the circles
            .raise();

    }).on("mouseout", function() {

        // Make the tooltip invisible when mouse "leaves" a point
        tooltip.style("visibility", "hidden");

        // Reset the circles' appearance back to original
        points.attr("opacity", 1);

        
    // Create the filter dropdown menu
    var filterOptions = ['acrylic', 'charcoal', 'collage', 'colored pencil', 'crayon', 'glass', 'gouache', 'graphite','ink','lithograph','paint','pen','pencil','print','steel','wood'];

    d3.select('#filter')
        .selectAll('option')
        .data(filterOptions)
        .enter()
        .append('option')
        .text(function(d) { return d.quantity; })
        .attr('value', function(d) { return d.quantity; });
    
    d3.select('#filter').on('change', function() {
        var selectedOption = d3.select(this).property('value');
        // Use the selectedOption to filter the data and update the scatterplot
        });
    
    var filteredData = data.filter(function(d) {
        return selectedOption === 'all' || d.quantity === selectedOption;
        });
    
        //enter update exit
    var circles = svg.selectAll('circle')
        .data(filteredData, function(d) { return d.id; });
      
      circles.enter().append('circle')
        .attr('cx', function(d) { return xScale(d.year); })
        .attr('cy', function(d) { return yScale(d.quantity); })
        .attr('r', function(d) { return rScale(d.quantity); })
        .attr('fill', function(d) {return fillScale(d.medium); });
      
      circles.exit().remove();
      
      circles.attr('cx', function(d) { return xScale(d.year); })
        .attr('cy', function(d) { return yScale(d.quantity); })
        .attr('r', function(d) { return rScale(d.quantity); })
        .attr('fill', function(d) {return fillScale(d.medium); });
      
    });
}
