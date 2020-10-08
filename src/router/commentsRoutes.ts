import React from 'react';

const COMMENT = React.lazy(() => import('../views/comment'));
const COMMENT_DETAIL = React.lazy(() => import('../views/comment/detail'));

const COMMENT_ROUTES_MAP = {
  comment: '/comments',
};

const COMMENT_ROUTES: Array<RouteConfigI> = [
  {
    path: COMMENT_ROUTES_MAP.comment,
    component: COMMENT,
  },
  {
    path: `${COMMENT_ROUTES_MAP.comment}/:id`,
    component: COMMENT_DETAIL,
  },
];

export {
  COMMENT_ROUTES_MAP,
  COMMENT_ROUTES,
};
