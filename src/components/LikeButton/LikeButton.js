import "./LikeButton.css";

function LikeButton(props) {
  const { dataHref = "https://developers.facebook.com/docs/plugins/" } = props;
  return (
    <div className="fb-like-container">
      <div
        class="fb-like"
        data-href="https://developers.facebook.com/docs/plugins/"
        data-width=""
        data-layout=""
        data-action=""
        data-size=""
        data-share="true"
      ></div>
      ;
    </div>
  );
}

export default LikeButton;
