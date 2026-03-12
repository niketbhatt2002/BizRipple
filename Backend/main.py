from fastapi import FastAPI, HTTPException, Query
from db import get_snowflake_connection
from typing import Optional
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can restrict this to your frontend domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

VIEW_MAP = {
    "salon": "SALON_RPT_VW",
    "cafe": "CAFE_RPT_VW",
    "restaurant": "RESTAURANT_RPT_VW",
    "retail": "RETAIL_RPT_VW",
    "pharmacy": "PHARMACY_RPT_VW"
}

@app.get("/")
def root():
    try:
        conn = get_snowflake_connection()
        print("Connected to Snowflake successfully!", conn)
        conn.close()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return {"message": "FastAPI + Snowflake Connected!"}

@app.get("/api/insights/open-close-trends")
def open_close_trends(
    type: str = Query(..., description="Business type (e.g., salon, cafe, retail)"),
    province: Optional[str] = Query(None, description="Province name"),
    city: Optional[str] = Query(None, description="City name"),
    year: Optional[int] = Query(None, description="Specific year")
):
    # Get the corresponding view
    view_name = VIEW_MAP.get(type.lower())
    if not view_name:
        raise HTTPException(status_code=400, detail="Invalid business type.")

    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()

        # Build dynamic WHERE clause
        filters = []
        if province:
            filters.append(f"PROVINCE = '{province}'")
        if city:
            filters.append(f"CITY_NAME = '{city}'")
        if year:
            filters.append(f"YEAR = {year}")

        where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""

        query = f"""
            SELECT YEAR, SUM(OPENED) AS total_opened, SUM(CLOSED) AS total_closed
            FROM {view_name}
            {where_clause}
            GROUP BY YEAR
            ORDER BY YEAR;
        """

        cursor.execute(query)
        rows = cursor.fetchall()

        result = [
            {"year": row[0], "opened": row[1], "closed": row[2]}
            for row in rows
        ]

        cursor.close()
        conn.close()
        return {"data": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/insights/footfall-by-city")
def footfall_by_city(
    type: str = Query(..., description="Business type (e.g., salon, cafe)"),
    province: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    year: Optional[int] = Query(None)
):
    view_name = VIEW_MAP.get(type.lower())
    if not view_name:
        raise HTTPException(status_code=400, detail="Invalid business type.")

    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()

        # Build filters
        filters = []
        if province:
            filters.append(f"PROVINCE = '{province}'")
        if city:
            filters.append(f"CITY_NAME = '{city}'")
        if year:
            filters.append(f"YEAR = {year}")

        where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""

        # Include year only if it is not specified (to return yearly trends)
        select_fields = "CITY_NAME, AVG(CONSUMER_FOOTFALL) AS total_footfall"
        group_by = "GROUP BY CITY_NAME, YEAR"

        if not year:
            select_fields = "CITY_NAME, YEAR, AVG(CONSUMER_FOOTFALL) AS total_footfall"
            group_by = "GROUP BY CITY_NAME, YEAR"

        query = f"""
            SELECT {select_fields}
            FROM {view_name}
            {where_clause}
            {group_by}
            ORDER BY total_footfall DESC
            limit 10;
        """

        cursor.execute(query)
        rows = cursor.fetchall()

        if year:
            result = [{"city": row[0], "footfall": row[1]} for row in rows]
        else:
            result = [{"city": row[0], "year": row[1], "footfall": row[2]} for row in rows]

        cursor.close()
        conn.close()
        return {"data": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/insights/wage-trends")
def wage_trends(
    type: str = Query(..., description="Business type (e.g., salon, cafe)"),
    province: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    year: Optional[int] = Query(None)
):
    view_name = VIEW_MAP.get(type.lower())
    if not view_name:
        raise HTTPException(status_code=400, detail="Invalid business type.")

    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()

        # Build WHERE clause dynamically
        filters = []
        if province:
            filters.append(f"PROVINCE = '{province}'")
        if city:
            filters.append(f"CITY_NAME = '{city}'")
        if year:
            filters.append(f"YEAR = {year}")

        where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""

        # Select and group dynamically
        if year:
            query = f"""
                SELECT CITY_NAME, AVG(MEDIAN_WAGE_CAD) AS median_wage
                FROM {view_name}
                {where_clause}
                GROUP BY CITY_NAME
                ORDER BY CITY_NAME;
            """
        else:
            query = f"""
                SELECT YEAR, AVG(MEDIAN_WAGE_CAD) AS median_wage
                FROM {view_name}
                {where_clause}
                GROUP BY YEAR
                ORDER BY YEAR;
            """

        cursor.execute(query)
        rows = cursor.fetchall()

        if year:
            result = [{"city": row[0], "median_wage": row[1]} for row in rows]
        else:
            result = [{"year": row[0], "median_wage": row[1]} for row in rows]

        cursor.close()
        conn.close()
        return {"data": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/insights/revenue-by-type-kpi")
def revenue_by_type_kpi(
    type: str = Query(..., description="Business type (e.g., salon, cafe)"),
    province: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    year: Optional[int] = Query(None)
):
    view_name = VIEW_MAP.get(type.lower())
    if not view_name:
        raise HTTPException(status_code=400, detail="Invalid business type.")

    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()

        # Build WHERE clause dynamically
        filters = []
        if province:
            filters.append(f"PROVINCE = '{province}'")
        if city:
            filters.append(f"CITY_NAME = '{city}'")
        if year:
            filters.append(f"YEAR = {year}")

        where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""


        query = f"""
                SELECT MAX(REVENUE_CAD) as max_rev_cad, MIN(REVENUE_CAD) as min_rev_cad, AVG(REVENUE_CAD) as avg_rev_cad, COUNT(DISTINCT YEAR) AS num_years
                FROM {view_name}
                {where_clause}
                
            """
        cursor.execute(query)
        rows = cursor.fetchall()

        result = [{"max_rev_cad": row[0], "min_rev_cad": row[1], "avg_rev_cad": row[2], "years": row[3]} for row in rows]
        

        cursor.close()
        conn.close()
        return {"data": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/insights/revenue-by-type-chart")
def revenue_by_type_chart(
    type: str = Query(...),
    province: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    # year: Optional[int] = Query(None)
):
    view_name = VIEW_MAP.get(type.lower())
    if not view_name:
        raise HTTPException(status_code=400, detail="Invalid business type.")
    
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()

        filters = []
        # if year:
        #     filters.append(f"YEAR = {year}")
        if province:
            filters.append(f"PROVINCE = '{province}'")
        if city:
            filters.append(f"MAX_REV.CITY_NAME = '{city}'")
        where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""

        query = f"""
            WITH max_rev AS (
                SELECT city_name, year AS max_year, revenue_cad AS max_rev_cad, policy_impact AS max_policy_impact 
                FROM {view_name} 
                QUALIFY ROW_NUMBER() OVER (PARTITION BY CITY_NAME ORDER BY REVENUE_CAD DESC) = 1
            ),
            min_rev AS (
                SELECT city_name, year AS min_year, revenue_cad AS min_rev_cad, policy_impact AS min_policy_impact 
                FROM {view_name} 
                QUALIFY ROW_NUMBER() OVER (PARTITION BY CITY_NAME ORDER BY REVENUE_CAD ASC) = 1
            ),
            avg_rev AS (
                SELECT city_name, AVG(revenue_cad) AS avg_rev_cad 
                FROM {view_name} 
                GROUP BY 1
            )
            SELECT 
                max_rev.city_name, max_rev.max_year, max_rev.max_rev_cad, max_rev.max_policy_impact, 
                min_rev.min_year, min_rev.min_rev_cad, min_rev.min_policy_impact, 
                avg_rev.avg_rev_cad 
            FROM max_rev 
            JOIN min_rev ON max_rev.city_name = min_rev.city_name
            JOIN avg_rev ON max_rev.city_name = avg_rev.city_name
            {where_clause}
            ORDER BY avg_rev.avg_rev_cad
            LIMIT 10;
        """

        cursor.execute(query)
        rows = cursor.fetchall()

        results = []
        for row in rows:
            results.append({
                "city": row[0],
                "max_year": row[1],
                "max_revenue": row[2],
                "max_policy_impact": row[3],
                "min_year": row[4],
                "min_revenue": row[5],
                "min_policy_impact": row[6],
                "average_revenue": row[7],
            })

        cursor.close()
        conn.close()
        return {"business_type": type.lower(), "data": results}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/insights/policy-impact-trend")
def policy_impact_trend(
    type: str = Query(...),
    province: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    policy_type: Optional[str] = Query(None)
):
    view_name = VIEW_MAP.get(type.lower())
    if not view_name:
        raise HTTPException(status_code=400, detail="Invalid business type.")

    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()

        # Map policy impact to numeric scale
        impact_case = """
            CASE POLICY_IMPACT
                WHEN 'Very High' THEN 3
                WHEN 'High' THEN 2
                WHEN 'Moderate' THEN 1
                WHEN 'Low' THEN -1
                WHEN 'Very Low' THEN -2
                WHEN 'None' THEN 0
                ELSE NULL
            END
        """

        filters = []
        if province:
            filters.append(f"PROVINCE = '{province}'")
        if city:
            filters.append(f"CITY_NAME = '{city}'")
        if year:
            filters.append(f"YEAR = {year}")
        if policy_type:
            filters.append(f"POLICY_TYPE = '{policy_type}'")

        where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""

        query = f"""
            SELECT YEAR, POLICY_TYPE, AVG({impact_case}) AS avg_impact_score
            FROM {view_name}
            {where_clause}
            GROUP BY YEAR, POLICY_TYPE
            ORDER BY YEAR, POLICY_TYPE
        """

        cursor.execute(query)
        rows = cursor.fetchall()
        result = [{"year": row[0], "policy_typr": row[1], "average_impact": row[2]} for row in rows]

        cursor.close()
        conn.close()
        return {"data": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/insights/cost-breakdown")
def cost_breakdown(
    type: str = Query(..., description="Business type (e.g., salon, cafe)"),
    province: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    year: Optional[int] = Query(None)
):
    view_name = VIEW_MAP.get(type.lower())
    if not view_name:
        raise HTTPException(status_code=400, detail="Invalid business type")

    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()

        filters = []
        if province:
            filters.append(f"PROVINCE = '{province}'")
        if city:
            filters.append(f"CITY_NAME = '{city}'")
        if year:
            filters.append(f"YEAR = {year}")

        where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""

        query = f"""
            SELECT
                AVG(RENT_COST_CAD) AS avg_rent,
                AVG(UTILITY_COST_CAD_PER_YR) AS avg_utility,
                MAX(RENT_COST_CAD) AS max_rent,
                MIN(RENT_COST_CAD) AS min_rent,
                MAX(UTILITY_COST_CAD_PER_YR) AS max_utility,
                MIN(UTILITY_COST_CAD_PER_YR) AS min_utility
            FROM {view_name}
            {where_clause}
        """

        cursor.execute(query)
        row = cursor.fetchone()

        result = {
            "average_rent": row[0] if row and row[0] is not None else 0,
            "average_utility": row[1] if row and row[1] is not None else 0,
            "max_rent": row[2] if row and row[2] is not None else 0,
            "min_rent": row[3] if row and row[3] is not None else 0,
            "max_utility": row[4] if row and row[4] is not None else 0,
            "min_utility": row[5] if row and row[5] is not None else 0
        }

        cursor.close()
        conn.close()
        return {"data": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/insights/business-population")
def business_population(
    type: str = Query(..., description="Business type (e.g., salon, cafe)"),
    year: Optional[int] = Query(None)
):
    view_name = VIEW_MAP.get(type.lower())
    if not view_name:
        raise HTTPException(status_code=400, detail="Invalid business type")

    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()

        filters = []
        if year:
            filters.append(f"YEAR = {year}")
        where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""

        query = f"""
            SELECT PROVINCE, SUM(TOTAL_SALONS) AS total_businesses
            FROM {view_name}
            {where_clause}
            GROUP BY PROVINCE
            ORDER BY PROVINCE
        """

        cursor.execute(query)
        rows = cursor.fetchall()

        result = [{"province": row[0], "total_businesses": row[1]} for row in rows]

        cursor.close()
        conn.close()
        return {"data": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/insights/business-count")
def business_count(
    type: str = Query(..., description="Business type"),
    province: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    year: Optional[int] = Query(None)
):
    view_name = VIEW_MAP.get(type.lower())
    if not view_name:
        raise HTTPException(status_code=400, detail="Invalid business type.")

    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()

        filters = []
        if province:
            filters.append(f"PROVINCE = '{province}'")
        if city:
            filters.append(f"CITY_NAME = '{city}'")
        if year:
            filters.append(f"YEAR = {year}")

        where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""

        query = f"""
            SELECT AVG(TOTAL_SALONS) AS total_count
            FROM {view_name}
            {where_clause}
        """

        cursor.execute(query)
        row = cursor.fetchone()
        count = row[0] if row and row[0] is not None else 0

        cursor.close()
        conn.close()
        return {"data": {"total_count": count}}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/insights/policy-distribution")
def policy_distribution(
    type: str = Query(..., description="Business type"),
    province: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    year: Optional[int] = Query(None)
):
    view_name = VIEW_MAP.get(type.lower())
    if not view_name:
        raise HTTPException(status_code=400, detail="Invalid business type.")

    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()

        filters = []
        if province:
            filters.append(f"PROVINCE = '{province}'")
        if city:
            filters.append(f"CITY_NAME = '{city}'")
        if year:
            filters.append(f"YEAR = {year}")

        where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""

        query = f"""
            SELECT POLICY_TYPE, COUNT(*) AS count, count(distinct POLICY_TYPE)
            FROM {view_name}
            {where_clause}
            GROUP BY POLICY_TYPE
            ORDER BY count DESC
        """

        cursor.execute(query)
        rows = cursor.fetchall()

        result = [{"policy_type": row[0], "count": row[1], "dist_count": row[2]} for row in rows]

        cursor.close()
        conn.close()
        return {"data": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/filters/options")
def get_filter_options(type: str = Query(..., description="Business type (e.g., salon, cafe)")):
    view_name = VIEW_MAP.get(type.lower())
    if not view_name:
        raise HTTPException(status_code=400, detail="Invalid business type")

    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()

        result = {}

        # Fetch provinces
        cursor.execute(f"SELECT DISTINCT PROVINCE FROM {view_name} ORDER BY PROVINCE")
        result["provinces"] = [row[0] for row in cursor.fetchall()]

        # Fetch cities
        cursor.execute(f"SELECT DISTINCT CITY_NAME FROM {view_name} ORDER BY CITY_NAME")
        result["cities"] = [row[0] for row in cursor.fetchall()]

        # Fetch years
        cursor.execute(f"SELECT DISTINCT YEAR FROM {view_name} ORDER BY YEAR")
        result["years"] = [row[0] for row in cursor.fetchall()]

        # Fetch policy types
        cursor.execute(f"SELECT DISTINCT POLICY_TYPE FROM {view_name} ORDER BY POLICY_TYPE")
        result["policy_types"] = [row[0] for row in cursor.fetchall()]

        cursor.close()
        conn.close()
        return {"data": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/advice/should-open")
def should_open_business(
    type: str = Query(...),
    city: str = Query(...),
    province: str = Query(...),
    year: int = Query(...)
):
    view_name = VIEW_MAP.get(type.lower())
    if not view_name:
        raise HTTPException(status_code=400, detail="Invalid business type")

    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()

        # Map policy impact values
        impact_case = """
            CASE POLICY_IMPACT
                WHEN 'Very High' THEN 3
                WHEN 'High' THEN 2
                WHEN 'Moderate' THEN 1
                WHEN 'Low' THEN -1
                WHEN 'Very Low' THEN -2
                WHEN 'None' THEN 0
                ELSE NULL
            END
        """

        # Analyze last 3 years before target year
        analysis_years = f"{year - 3}, {year - 2}, {year - 1}"

        query = f"""
            SELECT
                AVG(OPENED) AS avg_opened,
                AVG(CLOSED) AS avg_closed,
                AVG(REVENUE_CAD) AS avg_revenue,
                AVG(RENT_COST_CAD + UTILITY_COST_CAD_PER_YR) AS avg_costs,
                AVG({impact_case}) AS policy_score
            FROM {view_name}
            WHERE CITY_NAME = '{city}'
              AND PROVINCE = '{province}'
              AND YEAR IN ({analysis_years})
        """

        cursor.execute(query)
        row = cursor.fetchone()
        cursor.close()
        conn.close()

        if not row or all(r is None for r in row):
            return {"recommended": False, "confidence": "low", "summary": "Insufficient data."}

        avg_opened, avg_closed, avg_revenue, avg_costs, policy_score = row

        # Basic logic
        #as per algortihm the scores are getting calculated based oon the average opened or closed business, revenues, wages and policy impact
        score = 0
        reasons = []

        if avg_opened and avg_opened > avg_closed:
            score += 1
            reasons.append("More businesses are opening than closing.")
        else:
            score -= 1
            reasons.append("Closures are high compared to openings.")

        if avg_revenue and avg_costs and avg_revenue > avg_costs:
            score += 1
            reasons.append("Revenue consistently exceeds cost.")
        else:
            score -= 1
            reasons.append("Cost exceeds or matches revenue.")

        if policy_score and policy_score > 0:
            score += 1
            reasons.append("Positive policy impact.")
        else:
            score -= 1
            reasons.append("Policies impact are neutral or negative.")

        recommended = score >= 1
        confidence = "high" if score >= 2 else "medium" if score == 1 else "low"

        return {
            "recommended": recommended,
            "confidence": confidence,
            "summary": f"{type.title()} businesses in {city} show {confidence} potential based on historical trends.",
            "key_metrics": {
                "avg_opened": round(avg_opened or 0, 2),
                "avg_closed": round(avg_closed or 0, 2),
                "avg_revenue": round(avg_revenue or 0, 2),
                "avg_costs": round(avg_costs or 0, 2),
                "policy_score": round(policy_score or 0, 2)
            },
            "reasons": reasons
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/insights/policies-by-year")
def policies_by_year(
    type: str = Query(..., description="Business type"),
    year: int = Query(..., description="Year"),
    province: Optional[str] = Query(None),
    city: Optional[str] = Query(None)
):
    view_name = VIEW_MAP.get(type.lower())
    if not view_name:
        raise HTTPException(status_code=400, detail="Invalid business type.")

    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()

        # Build WHERE clause
        filters = [f"YEAR = {year}"]
        if province:
            filters.append(f"PROVINCE = '{province}'")
        if city:
            filters.append(f"CITY_NAME = '{city}'")

        where_clause = f"WHERE {' AND '.join(filters)}"

        query = f"""
            SELECT
                POLICY_ID,
                POLICY_TYPE,
                POLICY_IMPACT,
                CITY_NAME,
                PROVINCE,
                YEAR
            FROM {view_name}
            {where_clause}
        """

        cursor.execute(query)
        rows = cursor.fetchall()

        result = [
            {
                "policy_id": row[0],
                "policy_type": row[1],
                "policy_impact": row[2],
                "city": row[3],
                "province": row[4],
                "year": row[5],
                "business_type": type
            }
            for row in rows
        ]

        cursor.close()
        conn.close()
        return {"data": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/insights/city-growth-rate")
def city_growth_rate(
    type: str = Query(..., description="Business type (e.g., salon, cafe)"),
    province: Optional[str] = Query(None),
    min_year: Optional[int] = Query(None),
    max_year: Optional[int] = Query(None)
):
    view_name = VIEW_MAP.get(type.lower())
    if not view_name:
        raise HTTPException(status_code=400, detail="Invalid business type.")

    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()

        year_filters = []
        if min_year:
            year_filters.append(f"YEAR >= {min_year}")
        if max_year:
            year_filters.append(f"YEAR <= {max_year}")

        all_filters = []
        if province:
            all_filters.append(f"PROVINCE = '{province}'")
        if year_filters:
            all_filters.append(" AND ".join(year_filters))

        where_clause = f"WHERE {' AND '.join(all_filters)}" if all_filters else ""

        query = f"""
            SELECT CITY_NAME, YEAR, SUM(OPENED) AS total_opened
            FROM {view_name}
            {where_clause}
            GROUP BY CITY_NAME, YEAR
            ORDER BY CITY_NAME, YEAR
        """

        cursor.execute(query)
        rows = cursor.fetchall()
        from collections import defaultdict

        city_year_data = defaultdict(dict)
        for city, year, opened in rows:
            city_year_data[city][year] = opened

        growth_result = []
        for city, year_data in city_year_data.items():
            years = sorted(year_data.keys())
            if len(years) < 2:
                continue
            first, last = years[0], years[-1]
            opened_start = year_data[first]
            opened_end = year_data[last]
            if opened_start == 0:
                continue
            growth_rate = ((opened_end - opened_start) / opened_start) * 100
            growth_result.append({"city": city, "growth_rate": round(growth_rate, 2)})

        cursor.close()
        conn.close()
        return {"data": growth_result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/insights/policy-impact-by-province")
def policy_impact_heatmap(
    type: str = Query(..., description="Business type"),
    year: Optional[int] = Query(None)
):
    view_name = VIEW_MAP.get(type.lower())
    if not view_name:
        raise HTTPException(status_code=400, detail="Invalid business type.")

    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()

        # Map POLICY_IMPACT to numeric scores
        impact_case = """
            CASE POLICY_IMPACT
                WHEN 'Very High' THEN 3
                WHEN 'High' THEN 2
                WHEN 'Moderate' THEN 1
                WHEN 'Low' THEN -1
                WHEN 'Very Low' THEN -2
                WHEN 'None' THEN 0
                ELSE NULL
            END
        """

        where_clause = f"WHERE YEAR = {year}" if year else ""

        query = f"""
            SELECT PROVINCE, AVG({impact_case}) AS average_impact
            FROM {view_name}
            {where_clause}
            GROUP BY PROVINCE
            ORDER BY PROVINCE
        """

        cursor.execute(query)
        rows = cursor.fetchall()

        result = [{"province": row[0], "average_impact": row[1]} for row in rows]

        cursor.close()
        conn.close()
        return {"data": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/insights/failure-rate")
def failure_rate(
    type: str = Query(...),
    province: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    year: Optional[int] = Query(None)
):
    view_name = VIEW_MAP.get(type.lower())
    if not view_name:
        raise HTTPException(status_code=400, detail="Invalid business type.")

    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()

        filters = []
        if province:
            filters.append(f"PROVINCE = '{province}'")
        if city:
            filters.append(f"CITY_NAME = '{city}'")
        if year:
            filters.append(f"YEAR = {year}")
        where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""

        query = f"""
            SELECT 
                   SUM(CLOSED) AS total_closed,
                   SUM(OPENED) AS total_opened,
                   (1-(total_closed / total_opened)) * 100 AS success_rate
            FROM {view_name}
            {where_clause}
        """

        cursor.execute(query)
        rows = cursor.fetchall()

        result = [
            {
    
                "success_rate": row[2]
            }
            for row in rows
        ]

        cursor.close()
        conn.close()
        return {"data": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/insights/forecast-openings")
def forecast_openings(
    type: str = Query(...),
    city: str = Query(...),
    province: str = Query(...),
    target_year: int = Query(...)
):
    view_name = VIEW_MAP.get(type.lower())
    if not view_name:
        raise HTTPException(status_code=400, detail="Invalid business type.")

    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()

        query = f"""
            SELECT YEAR, SUM(OPENED) AS total_opened
            FROM {view_name}
            WHERE CITY_NAME = '{city}' AND PROVINCE = '{province}'
            GROUP BY YEAR
            ORDER BY YEAR
        """

        cursor.execute(query)
        rows = cursor.fetchall()

        if len(rows) < 2:
            return {"message": "Not enough historical data to forecast."}

        years = np.array([r[0] for r in rows])
        opened = np.array([r[1] for r in rows])

        # Fit linear model
        coefficients = np.polyfit(years, opened, 1)  # degree 1 = linear
        slope, intercept = coefficients

        forecast_years = list(range(target_year, target_year + 3))
        predictions = [
            {
                "year": y,
                "predicted_openings": round(slope * y + intercept, 2)
            } for y in forecast_years
        ]

        cursor.close()
        conn.close()

        return {
            "city": city,
            "forecast": predictions
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/insights/policy_rent_impact")
def policy_rent_impact(
    type: str = Query(...),
    province: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    ):

    view_name = VIEW_MAP.get(type.lower())
    if not view_name:
        raise HTTPException(status_code=400, detail="Invalid business type.")
    
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()

        impact_case = """
            CASE POLICY_IMPACT
                WHEN 'Very High' THEN 3
                WHEN 'High' THEN 2
                WHEN 'Moderate' THEN 1
                WHEN 'Low' THEN -1
                WHEN 'Very Low' THEN -2
                WHEN 'None' THEN 0
                ELSE NULL
            END
        """

        filters = []
        if province:
            filters.append(f"PROVINCE = '{province}'")
        if city:
            filters.append(f"CITY_NAME = '{city}'")
        if year:
            filters.append(f"YEAR = {year}")

        where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""

        query = f"""
            SELECT YEAR, POLICY_TYPE, AVG(RENT_COST_CAD) AS avg_rent_CAD, AVG({impact_case}) AS avg_impact_score
            FROM {view_name}
            {where_clause}
            GROUP BY YEAR, POLICY_TYPE
            ORDER BY YEAR, POLICY_TYPE
        """

        cursor.execute(query)
        rows = cursor.fetchall()
        result = [{"year": row[0], "policy_type": row[1], "avg_rent_CAD": row[2], "avg_impact_score": row[3]} for row in rows]

        cursor.close()
        conn.close()
        return {"data": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/insights/policy_cost_utility_impact")
def policy_cost_utility_impact(
    type: str = Query(...),
    province: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    ):

    view_name = VIEW_MAP.get(type.lower())
    if not view_name:
        raise HTTPException(status_code=400, detail="Invalid business type.")
    
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()

        impact_case = """
            CASE POLICY_IMPACT
                WHEN 'Very High' THEN 3
                WHEN 'High' THEN 2
                WHEN 'Moderate' THEN 1
                WHEN 'Low' THEN -1
                WHEN 'Very Low' THEN -2
                WHEN 'None' THEN 0
                ELSE NULL
            END
        """

        filters = []
        if province:
            filters.append(f"PROVINCE = '{province}'")
        if city:
            filters.append(f"CITY_NAME = '{city}'")
        if year:
            filters.append(f"YEAR = {year}")

        where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""

        query = f"""
            SELECT YEAR, POLICY_TYPE, AVG(UTILITY_COST_CAD_PER_YR) AS avg_cost_utility, AVG({impact_case}) AS avg_impact_score
            FROM {view_name}
            {where_clause}
            GROUP BY YEAR, POLICY_TYPE
            ORDER BY YEAR, POLICY_TYPE
        """

        cursor.execute(query)
        rows = cursor.fetchall()
        result = [{"year": row[0], "policy_type": row[1], "avg_cost_utility": row[2], "avg_impact_score": row[3]} for row in rows]

        cursor.close()
        conn.close()
        return {"data": result}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/insights/maximum_impact_of_policy")
def maximum_impact_of_policy(
    type: str = Query(...),
    province: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    ):

    view_name = VIEW_MAP.get(type.lower())
    if not view_name:
        raise HTTPException(status_code=400, detail="Invalid business type.")
    
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()

        impact_case = """
            CASE POLICY_IMPACT
                WHEN 'Very High' THEN 3
                WHEN 'High' THEN 2
                WHEN 'Moderate' THEN 1
                WHEN 'Low' THEN -1
                WHEN 'Very Low' THEN -2
                WHEN 'None' THEN 0
                ELSE NULL
            END
        """

        filters = []
        if province:
            filters.append(f"PROVINCE = '{province}'")
        if city:
            filters.append(f"CITY_NAME = '{city}'")
        if year:
            filters.append(f"YEAR = {year}")

        where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""

        query = f"""
            SELECT DISTINCT CITY_NAME, AVG({impact_case}) AS max_impact_score
            FROM {view_name}
            {where_clause}
            GROUP BY CITY_NAME
            ORDER BY max_impact_score DESC
            LIMIT 10
        """

        cursor.execute(query)
        rows = cursor.fetchall()
        result = [{"city": row[0], "impact_score": row[1]} for row in rows]
        cursor.close()
        conn.close()
        return {"data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@app.get("/api/insights/minimum_impact_of_policy")
def minimum_impact_of_policy(
    type: str = Query(...),
    province: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    ):

    view_name = VIEW_MAP.get(type.lower())
    if not view_name:
        raise HTTPException(status_code=400, detail="Invalid business type.")
    
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()

        impact_case = """
            CASE POLICY_IMPACT
                WHEN 'Very High' THEN 3
                WHEN 'High' THEN 2
                WHEN 'Moderate' THEN 1
                WHEN 'Low' THEN -1
                WHEN 'Very Low' THEN -2
                WHEN 'None' THEN 0
                ELSE NULL
            END
        """

        filters = []
        if province:
            filters.append(f"PROVINCE = '{province}'")
        if city:
            filters.append(f"CITY_NAME = '{city}'")
        if year:
            filters.append(f"YEAR = {year}")

        where_clause = f"WHERE {' AND '.join(filters)}" if filters else ""

        query = f"""
            SELECT * FROM (SELECT DISTINCT CITY_NAME, AVG({impact_case}) AS min_impact_score
            FROM {view_name}
            {where_clause}
            GROUP BY CITY_NAME
            ORDER BY min_impact_score ASC
            ) WHERE min_impact_score != 0  LIMIT 10
        """

        cursor.execute(query)
        rows = cursor.fetchall()
        result = [{"city": row[0], "impact_score": row[1]} for row in rows]
        cursor.close()
        conn.close()
        return {"data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
