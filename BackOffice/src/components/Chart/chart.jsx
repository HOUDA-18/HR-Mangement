import "./chart.scss"
import {
    AreaChart,
    Area,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    YAxis,
  } from "recharts";
  
  const data = [
    { name: "January", Total: 90 },
    { name: "February", Total: 82 },
    { name: "March", Total: 95 },
    { name: "April", Total: 87 },
    { name: "May", Total: 86 },
    { name: "June", Total: 91 },
  ];


const Chart = ({aspect, title}) =>{
    return( 
     <div className="chart">
        <div className="title">{title}</div>
            <ResponsiveContainer width="100%" aspect={aspect}>
                <AreaChart
                width={730}
                height={200}
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                <defs>
                    <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="gray" />
                <YAxis/>
                <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
                <Tooltip />
                <Area
                    type="monotone"
                    dataKey="Total"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#total)"
                />
                </AreaChart>
            </ResponsiveContainer>     
    </div>
    )
}

export default Chart;