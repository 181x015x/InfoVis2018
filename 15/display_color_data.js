function display_color_data(differ){
var list1 = [];
var list2 = [];
var list3 = [];
var center = [];
var differ_2 = differ * 2;
for ( var i = 0; i < 256; i++ )
    {
        var S = i / 255.0; // [0,1]
        var R = 50*Math.max( Math.cos( ( S - differ_2 ) * Math.PI ), 0.0 );
        var G = 50*Math.max( Math.cos( ( S - differ ) * Math.PI ), 0.0 );
        var B = 50*Math.max( Math.cos( S * Math.PI ), 0.0 );
        list1.push(R);
        list2.push(G);
        list3.push(B);
        center.push(0);
    }
    document.getElementById('detail').innerHTML = "R : max ( cos( ( x - "+differ_2+" ) * π　), 0 )\nG : max ( cos( ( x - "+differ+" ) * π　), 0 )\nB : max ( cos( ( x ) * π　), 0 )\n"
var svgWidth = window.innerWidth * 0.1; // SVG領域の横幅
var svgHeight = window.innerHeight * 0.1;    // SVG領域の縦幅
//ページの初期化
d3.select("#myGraph").selectAll("svg").remove();
// SVGの表示領域を生成
var svg = d3.select("#myGraph").append("svg")
    .attr("width", svgWidth).attr("height", svgHeight)
// 折れ線を生成
var line = d3.svg.line()
    .x(function(d, i){ return i * svgWidth/(list1.length-1); }) // 横方向はSVG領域に合わせて調整。データは最低2個あるのが前提
    .y(function(d){ return svgHeight-d; })  // 縦方向は数値そのままでスケール等しない
// 折れ線グラフ1を描画
svg.append("path")
    .attr("d", line(list1)) // 線を描画
    .attr("stroke", "red")    // 線の色を指定
    .attr("fill", "none");  // 塗り潰しなし。指定しないと黒色で塗り潰される
// 折れ線グラフ2を描画
svg.append("path")
    .attr("d", line(list2)) // 線を描画
    .attr("stroke", "green")  // 線の色を指定
    .attr("fill", "none");  // 塗り潰しなし。指定しないと黒色で塗り潰される
svg.append("path")
    .attr("d", line(list3)) // 線を描画
    .attr("stroke", "blue")  // 線の色を指定
    .attr("fill", "none");  // 塗り潰しなし。指定しないと黒色で塗り潰される
    //軸
svg.append("path")
    .attr("d", line(center)) // 線を描画
    .attr("stroke", "black")　// 線の色を指定
    .attr("stroke-width", 3)  
    .attr("fill", "none");  // 塗り潰しなし。指定しないと黒色で塗り潰される
}
