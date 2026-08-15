import { data as postData, content as postContent } from "./post.md";
import notes from "./notes.mdown";
import readme from "./readme.markdown";
import plain from "./plain.md";

console.log(
  JSON.stringify({
    post: { data: postData, content: postContent },
    notes,
    readme,
    plain,
  }),
);
