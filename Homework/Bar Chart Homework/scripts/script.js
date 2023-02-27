d3.csv("./data/sightings.csv").then(function(data) {

    //define dim 
    const width = document.querySelector("#chart").clientWidth; 
    const height = document.querySelector("#chart").clientHeight;
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    //filter data
    let filtered_data = data.filter(function(d) {
        return d.country === 'United States';
    });

    //min max values 
    const sightings = {
        min: d3.min(filtered_data, function(d) { return +d.sightings; }),
        max: d3.max(filtered_data, function(d) { return +d.sightings; })
    }; 

    //scales
    const margin = {
        top: 50,
        left: 100,
        right: 50, 
        bottom: 100
    };
    const xScale = d3.scaleBand()
        .domain(["ca","wa","fl","tx","ny","il","az","pa","oh","mi"])
        .range([margin.left, width - margin.right])
        .padding(0.5); 
    const yScale = d3.scaleLinear()
        .domain([0, sightings.max]) 
        .range([height - margin.bottom, margin.top]);

    //axes
    const xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));
    const yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));

    //bars
    const points = svg.selectAll("rect")
        .data(filtered_data)
        .enter()
        .append("rect")
            .attr("x", function(d) { return xScale(d.state); })
            .attr("y", function(d) { return yScale(d.sightings); })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { return height - (margin.bottom + yScale(d.sightings)) })
            .attr("fill", "blue"); 
    
    //axis labels
    const xAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("x", width/2)
        .attr("y", height-margin.bottom/2)
        .text("State"); 
    const yAxisLabel = svg.append("text")
        .attr("class","axisLabel")
        .attr("transform","rotate(-90)")
        .attr("x", -height/2)
        .attr("y", margin.left/2)
        .text("Number of Sightings");
});