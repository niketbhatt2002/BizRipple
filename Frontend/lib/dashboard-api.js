export async function getDashboardData(filters) {
  try {
    const { type, province, city, year } = filters;
    const queries = new URLSearchParams();
    if (type) queries.append("type", type);
    if (province) queries.append("province", province);
    if (city) queries.append("city", city);
    if (year) queries.append("year", year);

    const [countRes, revenueRes, wageRes, failureRes, trendRes, footfallRes] =
      await Promise.all([
        fetch(`http://127.0.0.1:8000/api/insights/business-count?${queries}`),
        fetch(
          `http://127.0.0.1:8000/api/insights/revenue-by-type-kpi?${queries}`
        ),
        fetch(`http://127.0.0.1:8000/api/insights/wage-trends?${queries}`),
        fetch(`http://127.0.0.1:8000/api/insights/failure-rate?${queries}`),
        fetch(
          `http://127.0.0.1:8000/api/insights/open-close-trends?${queries}`
        ),
        fetch(`http://127.0.0.1:8000/api/insights/footfall-by-city?${queries}`),
      ]);

    const [count, revenue, wage, failure, trends, footfall] = await Promise.all(
      [
        countRes.json(),
        revenueRes.json(),
        wageRes.json(),
        failureRes.json(),
        trendRes.json(),
        footfallRes.json(),
      ]
    );

    const avgRevenue =
      revenue?.data?.map((item) => Math.round(item.avg_rev_cad)) || 0;

    const medianWage =
      wage?.data?.length > 0 ? Math.round(wage.data[0].median_wage || 0) : 0;

    const avgFailureRate = failure?.data?.map((item) => item.success_rate.toFixed(2)) || 0;

    return {
      businessCount: count.data.total_count,
      avgRevenue: avgRevenue,
      medianWage: medianWage,
      failureRate: `${avgFailureRate}%`,
      openCloseTrends: trends.data || [],
      footfallByCity: footfall.data || [],
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      businessCount: 0,
      avgRevenue: 0,
      medianWage: 0,
      failureRate: "0%",
      openCloseTrends: [],
      footfallByCity: [],
    };
  }
}
