d3.csv("./data/gapminder.csv").then(function(data) {

    //everything below refers to gapminder.csv because the variable 'data' binds to this dataset 
    
    /*
    1. DEFINE DIMENSIONS OF SVG + CREATE SVG CANVAS
    */
    const width = document.querySelector("#chart").clientWidth;
    const height = document.querySelector("#chart").clientHeight;
    
    //initializing the viewport of the svg canvas
    //an svg canvas viewport has a width and height 
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height); 
    
    /*
    2. FILTER THE DATA 
    */
    //initialize a new variable 
    let filtered_data = data.filter(function(d) {
        return d.country === 'Italy'; 
    });
    
    /*
    3. DETERMINE MIN AND MAX VALUES OF VARIABLES
    */
    
    //"+" = cast string prototype to number 
    
    const lifeExp = {
        min: d3.min(filtered_data, fuction(d) { return +d.lifeExp; }),
        max: d3.max(filtered_data, fuction(d) { return +d.lifeExp; })
    }; 
    
    /*
    4. CREATE SCALES 
    */
    const margin = {
        top: 50, 
        left: 100, 
        right: 50, 
        bottom: 100
    };     
    
    const xScale = d3.scaleBand()
        .domain(["1952","1957","1962","1967","1972","1977","1982","1987","1992","1997","2002","2007"])
        .range([margin.left, width - margin.right])
        .padding(0.5); 
        //padding = gaps between bars 
    
    const yScale = d3.scaleLinear()
        .domain([50, lifeExp.max])
        .range([height - margin.bottom, margin.top]);
        //"-" is a subtraction (margin) to make space for labels 
    
    /*
    5. DRAW AXES 
    */
    const xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform",`translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));


        
    
    const yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform",`translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));
    
    /*
    6. DRAW BARS 
    */
    const points = svg.selectAll("rect")
        .data(filtered_data)
        .enter()
        .append("rect")
            .attr("x", fnction(d) { return xScale(d.year); })
            .attr("y", fnction(d) { return yScale(d.lifeExp); })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { return height - (margin.bottom + yScale(d.lifeExp)) })
            .attr("fill", "green"); 
    
    /*
    7. DRAW AXIS LABELS
    */
    const xAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("x", width/2)
        .attr("y", height-margin.bottom/2)
        .text("Year");
    
    const yAxisLabel = svg.append("text")
        .attr("class", "axisLabel")
        .attr("transform","rotate(-90)")
        .attr("x", -height/2)
        .attr("y", margin.left/2)
        .text("Life Expectancy (Years)");

});