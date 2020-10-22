import React, { useEffect, useState } from 'react';
import { Axis, Chart, Coordinate, Interval, Line, Point, Tooltip } from 'bizcharts';
import { compose, groupWith, map } from 'ramda';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { GET_ALL_ARTICLES } from '../../api/article';
import useRequest from '../../hooks/useRequest';

interface PVChartDataI {
  page: string;
  view: number;
}
interface UVChartDataI {
  date: string;
  view: number;
}

interface PropsI {
  articles: Array<ArticleI>
}

const mapState2Props = (state: AppState) => ({
  articles: state.common.articles,
});

const Dashboard = (props: PropsI) => {
  const [, getArticlesRes, getArticles] = useRequest(GET_ALL_ARTICLES, false);
  const [pvData, setPVData] = useState<Array<PVChartDataI>>([]);
  const [uvData] = useState<Array<UVChartDataI>>([]);

  useEffect(() => {
    if (!getArticles || !getArticlesRes?.success) return;
    compose(
      setPVData,
      map<Array<ArticleI>, PVChartDataI>((item) => ({ page: item[0].author, view: item.length })),
      groupWith<ArticleI>((a, b) => a.author === b.author),
    )(getArticlesRes.data);
  }, [getArticles, getArticlesRes, props.articles]);

  return (
    <div className="container">
      <div className="top" />
      <div className="center">
        <Chart height={320} autoFit data={uvData} padding={[10, 100, 50, 100]} scale={{ view: { alias: '访问量', min: 0 }, date: { alias: '日期' } }}>
          <Axis name="date" title={{ autoRotate: true }} />
          <Axis name="view" title={{ autoRotate: true }} />
          <Line position="date*view" shape="smooth" />
          <Point position="date*view" />
        </Chart>
      </div>
      <div className="bottom">
        <Chart height={400} data={pvData} autoFit>
          <Coordinate type="theta" radius={0.75} />
          <Tooltip showTitle={false} />
          <Axis visible={false} />
          <Interval
            position="view"
            adjust="stack"
            color="page"
            label={['*', {
              content: (data) => `${data.page}: ${data.view}`,
            }]}
          />
        </Chart>
      </div>
    </div>
  );
};

export default connect(mapState2Props)(Dashboard);
