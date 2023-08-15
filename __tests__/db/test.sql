\c nc_news_test

SELECT articles.author,
       articles.title,
       articles.article_id,
       articles.topic,
       articles.created_at,
       articles.votes,
       articles.article_img_url,
       Count(*)::INT AS comment_count
FROM   articles
       JOIN comments
         ON articles.article_id = comments.article_id
GROUP  BY articles.author,
          articles.title,
          articles.article_id,
          articles.topic,
          articles.created_at,
          articles.votes,
          articles.article_img_url;  