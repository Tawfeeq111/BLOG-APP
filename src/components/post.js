import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";

export default function Post({_id, content, cover, createdAt, summary, title, author}) {
  // console.log(content, cover, createdAt, summary, title);  
  return (
        <div className="post">
        <div className="image">
          <Link to={`/post/${_id}`}>
            <img src={"http://localhost:4000/"+cover} alt="failed to render!" />
          </Link>
        </div>
        <div className="title">
          <Link to={`/post/${_id}`}>
            <h2>{title}</h2>
          </Link>
          <div className="info">
            <a href="#" className="author">{author}</a>
          <time>{formatISO9075(new Date(createdAt))}</time>
        </div>
          <p>{summary}</p>
        </div>
      </div>
    )
}