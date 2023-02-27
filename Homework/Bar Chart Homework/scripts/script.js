d3.csv(".tata/complete.csv").then(function(data) {
    // define dim of svg and create svg canvas 
    const width = document.querySelector("#chart").clientWidth;
    const height = document.querySelector("#chart").clientHeight;
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    //filter data
    let filtered_data = data.filter(function(d) {
        return d.country === 'us';
    });
    
    //determine min and max values of variables 
    const durationseconds = {
        min: d3.min(filtered_data, function(d) {return +d.durationseconds; });
        max: d3.max(filtered_data, function(d) {return +d.durationseconds; })
    };

    //create scales
    const margin = {
        top: 50, 
        left: 100,
        right: 50,
        bottom: 100
    };
    const xScale = d3.scaleBand()
        .domain (["tx","ny","sc","ca","pa","oh","ma","va","ct","or","az","wa","nm","ri","mi","il","fl","la","vt","mo","nh","wv"])
        .range ([margin.left, width - margin.right])
        .padding (0.5);
    const yScale = d3.scalelinear()
        .domain([0, durationseconds.max])
        .range([height - margin.bottom, margin.top]);

    //draw axes
    const xAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(0,${height-margin.bottom})`)
        .call(d3.axisBottom().scale(xScale));
    const yAxis = svg.append("g")
        .attr("class","axis")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft().scale(yScale));

    //draw bars
    const points = svg.selectAll("rect")
        .data(filtered_data)
        .enter()
        .append("rect")
            .attr("x", function(d) { return xScale(d.state); })
            .attr("y", function(d) { return yScale(d.durationseconds); })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) { return height - (margin.bottom + yScale(d.durationseconds)) })
            .attr("fill", "steelblue");

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
        .text("Duration (Seconds)");
});