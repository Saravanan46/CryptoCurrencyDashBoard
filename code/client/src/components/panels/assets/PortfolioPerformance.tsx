// react
import { useCallback, useEffect, useState } from "react";
// ui
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import BasicChart from "@/charts/BasicChart";
import { Skeleton } from "@/components/ui/skeleton";
import { sortDataByTimestamp } from "@/lib/portfolioUtils";
// utils
import { fetchPortfolioValues } from "@/lib/portfolioUtils";
// store
import { useUserStore } from "@/stores/useUserStore";

interface PortfolioValueEntry {
  timestamp: string;
  value: number;
}


export default function PortfolioPerformance() {
  const [chartData, setChartData] = useState<PortfolioValueEntry[]>();
  const accessToken = useUserStore((state) => state.accessToken);

  const fetchAndSetChartData = useCallback(async () => {
    try {
      const data = await fetchPortfolioValues(accessToken);
      console.log("Fetched data:", data);
  
      if (data) {
        const sortedData = sortDataByTimestamp(data);
  
        // Append current time data point
        const currentTimeEntry = {
          timestamp: new Date().toISOString(),
          value: sortedData[sortedData.length - 1]?.value || 100, // Use last value or default
        };
  
        setChartData([...sortedData, currentTimeEntry]);
      } else {
        console.error("No data received");
      }
    } catch (error) {
      console.error("Error fetching portfolio values:", error);
    }
  }, [accessToken]);
  

  useEffect(() => {
    fetchAndSetChartData();
  }, [fetchAndSetChartData]);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent className="py-4">
          {chartData ? (
            <BasicChart data={chartData} />
          ) : (
            <Skeleton className="w-full h-[250px] rounded dark:bg-zinc-400" />
          )}
        </CardContent>
      </Card>
    </>
  );
}
