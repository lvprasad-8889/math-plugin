import useStore from "../../Store/useStore";

const checkCommunity = (words) => {
  const origin = window.location.origin;

  let result;
  words.map((word, index) => {
    if (origin.includes(word)) {
      result = index;
      return;
    }
  });
  return result;
};

const wordsToCheck = ["italent", "jmp", , "sas", "sap"];

const communityIndex = checkCommunity(wordsToCheck)
  ? checkCommunity(wordsToCheck)
  : 0;

const isInsideJmp = () => {
  const observer = new MutationObserver(() => {
    if (document.body.classList.contains("inside_jmp")) {
      useStore.getState().setInsideJmp(true);
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ["class"],
  });
};

isInsideJmp();

// variables for necessaru info
const prod = !/^http:\/\/localhost:\d{4}$/.test(origin);

const classList = document.body.classList;

const pageClass = Array.from(classList).find((className) =>
  className.endsWith("Page")
);

const page = {
  forumTopicPage: pageClass === "ForumTopicPage",
  postPage: pageClass === "PostPage",
  tkbArticleEditorPage: pageClass === "TkbArticleEditorPage",
  tkbArticlePage: pageClass === "TkbArticlePage",
  editPage: pageClass === "EditPage",
  BlogPage: pageClass && pageClass.startsWith("Blog"),
  TkbPage: pageClass && pageClass.startsWith("Tkb"),
  blogArticlePage: pageClass === "BlogArticlePage",
};

let tkbPageException =
  (page.tkbArticleEditorPage || page.tkbArticlePage) && communityIndex === 1;

const community = {
  0: {
    firstNode: ".lia-forum-topic-message-gte-5",
    replies: [
      "threadeddetaildisplaymessageviewwrapper",
      "threadedDetailDisplayMessageViewWrapper",
    ],
    dynamicMessageSelectors: ["#threadeddetailmessagelist"],
  },
  1: {
    firstNode: "#lineardisplaymessageviewwrapper",
    replies: [
      "lineardisplaymessageviewwrapper",
      "linearDisplayMessageViewWrapper",
    ],
    dynamicMessageSelectors: [
      ".linear-message-list.message-list",
      ".lia-component-reply-list > .linear-message-list.message-list",
    ],
  },
  2: {
    firstNode: "#lineardisplaymessageviewwrapper",
    replies: [
      "lineardisplaymessageviewwrapper",
      "linearDisplayMessageViewWrapper",
    ],
  },
  3: {
    firstNode: "#lineardisplaymessageviewwrapper",
    replies: [
      "lineardisplaymessageviewwrapper",
      "linearDisplayMessageViewWrapper",
    ],
  },
};

const makeInsertVideoBtnInline = () => {
  if (page.tkbArticleEditorPage && prod) {
    let iframe = document.getElementById("tinyMceEditor_ifr");
    let innerDoc = iframe.contentDocument || iframe.contentWindow.document;
    innerDoc.body.style.overflow = "auto";
  }
};

// if current device is mobile we should show math plugin but we must render math equations or expressions
const isMobile = () => {
  const userAgent = navigator.userAgent;
  const isUserAgentMobile =
    /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isScreenSmall = window.matchMedia("(max-width: 768px)").matches;

  return isUserAgentMobile || isScreenSmall;
};

const isMathPluginUser = () => {
  let mathPluginUser = document.body.classList.contains("math-plugin-user");
  useStore.getState().setHasMathPluginRole(mathPluginUser);
  return mathPluginUser;
};

let communityCdn = {
  0: "#threadeddetailmessagelist",
  1: ".lia-component-reply-list > :first-child",
};

const fontSize = prod ? "1.5rem" : "1rem";

const theme = "#6c757d";

let variables = {
  community,
  communityIndex,
  isMathPluginUser,
  isMobile,
  makeInsertVideoBtnInline,
  page,
  pageClass,
  prod,
  tkbPageException,
  communityCdn,
  fontSize,
  theme,
};

export default variables;
