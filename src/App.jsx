import { useState, useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";
import suxoImage from "../public/suxo.jpg";

const isValidDate = (date) => !isNaN(new Date(date).getTime());

const CommentSection = () => {
  const [comments, setComments] = useState(() => {
    const storedComments = localStorage.getItem("comments");
    return storedComments ? JSON.parse(storedComments) : [];
  });
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [replyToComment, setReplyToComment] = useState(null);
  const [newReply, setNewReply] = useState("");

  const replyInputRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("comments", JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        replyInputRef.current &&
        !replyInputRef.current.contains(event.target) &&
        replyToComment
      ) {
        setReplyToComment(null);
        setNewReply("");
      }
      if (
        editInputRef.current &&
        !editInputRef.current.contains(event.target) &&
        editingComment
      ) {
        setEditingComment(null);
        setEditedText("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [replyToComment, editingComment]);

  const addComment = (parentId = null) => {
    const commentText = parentId ? newReply : newComment;
    if (!commentText.trim()) return;

    const comment = {
      id: Date.now(),
      text: commentText,
      createdAt: new Date().toISOString(),
      votes: 0,
      parentId: parentId,
      name: "SUXO",
    };

    setComments([comment, ...comments]);
    if (parentId) {
      setNewReply("");
    } else {
      setNewComment("");
    }

    setReplyToComment(null);
  };

  const deleteComment = (id) => {
    setComments((prevComments) =>
      prevComments.filter(
        (comment) => comment.id !== id && comment.parentId !== id
      )
    );
  };

  const updateVotes = (id, change) => {
    setComments(
      comments.map((comment) =>
        comment.id === id
          ? { ...comment, votes: Math.max(0, comment.votes + change) }
          : comment
      )
    );
  };

  const editComment = (id, newText) => {
    if (newText.trim() === "") return;
    setComments(
      comments.map((comment) =>
        comment.id === id ? { ...comment, text: newText } : comment
      )
    );
    setEditingComment(null);
    setEditedText("");
  };

  const MAX_COMMENT_LENGTH = 700;

  const renderComments = (parentId = null) => {
    return comments
      .filter((comment) => comment.parentId === parentId)
      .map((comment) => (
        <div key={comment.id} className={` flex items-end flex-col mt-4`}>
          <div
            className="bg-white p-4 shadow-md rounded-lg    mt-4 flex flex-col space-y-4"
            style={{ width: parentId ? "642px" : "730px" }}
          >
            <div className="flex space-x-4">
              <div className="w-10 h-[100px] bg-[#f5f6fa] rounded-[10px] px-1.5 py-2">
                <button
                  onClick={() => updateVotes(comment.id, 1)}
                  className="text-xl"
                >
                  <div data-svg-wrapper className="mx-2">
                    <svg
                      width="12.5"
                      height="11"
                      viewBox="0 0 11 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.33018 10.896C6.46674 10.896 6.58468 10.8463 6.684 10.747C6.78331 10.6477 6.83297 10.5298 6.83297 10.3932V7.004H10.1477C10.2842 7.004 10.4022 6.95434 10.5015 6.85503C10.6008 6.75571 10.6505 6.63777 10.6505 6.50121V5.27216C10.6505 5.1356 10.6008 5.01766 10.5015 4.91834C10.4022 4.81903 10.2842 4.76937 10.1477 4.76937H6.83297V1.39879C6.83297 1.26223 6.78331 1.14429 6.684 1.04497C6.58468 0.945655 6.46674 0.895996 6.33018 0.895996H4.91491C4.77835 0.895996 4.66041 0.945655 4.56109 1.04497C4.46177 1.14429 4.41212 1.26223 4.41212 1.39879V4.76937H1.07878C0.942221 4.76937 0.824282 4.81903 0.724965 4.91834C0.625647 5.01766 0.575989 5.1356 0.575989 5.27216V6.50121C0.575989 6.63777 0.625647 6.75571 0.724965 6.85503C0.824282 6.95434 0.942221 7.004 1.07878 7.004H4.41212V10.3932C4.41212 10.5298 4.46177 10.6477 4.56109 10.747C4.66041 10.8463 4.77835 10.896 4.91491 10.896H6.33018Z"
                        fill="#C5C6EF"
                      />
                    </svg>
                  </div>
                </button>
                <p className="text-center text-[#5357b6] text-base font-normal mx-2">
                  {comment.votes}
                </p>
                <button
                  onClick={() => updateVotes(comment.id, -1)}
                  className="text-xl"
                >
                  <div data-svg-wrapper className="mx-2">
                    <svg
                      width="12.5"
                      height="3"
                      viewBox="0 0 10 3"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.25591 2.66C9.46018 2.66 9.63659 2.60445 9.78515 2.49334C9.93371 2.38223 10.008 2.25028 10.008 2.0975V0.722504C10.008 0.569726 9.93371 0.437781 9.78515 0.32667C9.63659 0.215559 9.46018 0.160004 9.25591 0.160004H0.760085C0.555814 0.160004 0.379398 0.215559 0.230837 0.32667C0.082276 0.437781 0.00799561 0.569726 0.00799561 0.722504V2.0975C0.00799561 2.25028 0.082276 2.38223 0.230837 2.49334C0.379398 2.60445 0.555814 2.66 0.760085 2.66H9.25591Z"
                        fill="#C5C6EF"
                      />
                    </svg>
                  </div>
                </button>
              </div>
              <div
                className="flex-grow "
                style={{ maxWidth: parentId ? "530px" : "618px" }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <img
                      src={suxoImage}
                      alt="User"
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-row items-center gap-3">
                      <p className="font-semibold">{comment.name}</p>
                      <p className="text-[#67727e] text-base font-normal leading-normal">
                        {isValidDate(comment.createdAt)
                          ? formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })
                          : "Unknown time"}
                      </p>
                    </div>
                  </div>
                  <div className="space-x-2 flex flex-row self-end">
                    <button
                      onClick={() => setConfirmDelete(comment.id)}
                      className="text-red-500 text-base font-normal cursor-pointer hover:opacity-70 leading-normal flex flex-row"
                    >
                      <div data-svg-wrapper className="my-1 mr-1 ml-2.5">
                        <svg
                          width="12"
                          height="16"
                          viewBox="0 0 12 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8.64458 1.16667H11.5261V2.33333H0V1.16667H2.88153L3.84633 0H7.67981L8.64458 1.16667ZM2.68944 14C1.8441 14 1.15261 13.3017 1.15261 12.4479V3.5H10.3735V12.4479C10.3735 13.3017 9.682 14 8.8367 14H2.68944Z"
                            fill="#e62930"
                          />
                        </svg>
                      </div>
                      Delete
                    </button>
                    <button
                      onClick={() => setEditingComment(comment.id)}
                      className="text-[#5357b6] text-base font-normal cursor-pointer hover:opacity-70 leading-normal flex flex-row hover:cursor-pointer"
                    >
                      <div data-svg-wrapper className="my-1 mr-1 ml-2.5">
                        <svg
                          width="14"
                          height="16"
                          viewBox="0 0 14 14"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M11.0813 0.474468L13.4788 2.87199C14.1491 3.51055 14.1765 4.57097 13.5401 5.24327L5.66499 13.1184C5.37977 13.4012 5.00593 13.5773 4.60623 13.6171L0.957442 13.9496H0.878691C0.646111 13.951 0.422565 13.8596 0.257434 13.6959C0.0728398 13.5119 -0.0201832 13.2553 0.00368177 12.9959L0.379936 9.34706C0.419753 8.94736 0.595858 8.57352 0.878691 8.2883L8.75377 0.413217C9.43263 -0.160306 10.4336 -0.133966 11.0813 0.474468ZM8.15877 3.4495L10.5038 5.79452L12.2538 4.08826L9.86504 1.69948L8.15877 3.4495Z"
                            fill="#5357B6"
                          />
                        </svg>
                      </div>
                      Edit
                    </button>
                    <button
                      onClick={() => setReplyToComment(comment.id)}
                      className="text-[#5357b6] text-base  font-normal hover:opacity-70 cursor-pointer leading-normal flex flex-row"
                    >
                      <div data-svg-wrapper className="my-1 mr-1 ml-2.5">
                        <svg
                          width="14"
                          height="16"
                          viewBox="0 0 14 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.227189 4.31583L5.0398 0.159982C5.46106 -0.203822 6.125 0.0915222 6.125 0.656646V2.8456C10.5172 2.89589 14 3.77618 14 7.93861C14 9.61864 12.9177 11.283 11.7214 12.1532C11.348 12.4247 10.816 12.0839 10.9536 11.6437C12.1935 7.67857 10.3655 6.62588 6.125 6.56484V8.96878C6.125 9.5348 5.46056 9.82883 5.0398 9.46545L0.227189 5.30918C-0.0755195 5.04772 -0.0759395 4.57766 0.227189 4.31583Z"
                            fill="#5357B6"
                          />
                        </svg>
                      </div>
                      Reply
                    </button>
                  </div>
                </div>

                {editingComment === comment.id ? (
                  <div
                    className="flex items-end space-x-2 flex-col"
                    ref={editInputRef}
                  >
                    <textarea
                      className="w-full border p-2 mt-2 rounded-lg resize-none"
                      defaultValue={comment.text}
                      onChange={(e) => setEditedText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          if (editedText.trim() !== "") {
                            editComment(comment.id, editedText);
                          }
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (editedText.trim() !== "") {
                          editComment(comment.id, editedText);
                        }
                      }}
                      className="w-[104px] h-12 bg-[#5357b6] rounded-lg text-white mt-4 mr-1.5 cursor-pointer hover:bg-[#5356b69f]"
                    >
                      Update
                    </button>
                  </div>
                ) : (
                  <p className="mt-2 w-full text-gray-700 whitespace-pre-wrap break-words">
                    {comment.text.length > MAX_COMMENT_LENGTH
                      ? `${comment.text.substring(0, MAX_COMMENT_LENGTH)}...`
                      : comment.text}
                  </p>
                )}
              </div>
            </div>
          </div>
          {replyToComment === comment.id && (
            <div
              ref={replyInputRef}
              className="mt-4 ml-0 flex bg-white  rounded-md shadow-xl space-x-4 p-4"
              style={{ width: parentId ? "642px" : "730px" }}
            >
              <img
                src={suxoImage}
                alt="suxo"
                className="w-8 h-8 rounded-full mt-1"
              />
              <textarea
                className="w-full h-24 border p-4 rounded-lg resize-none"
                placeholder="Write your reply..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    addComment(replyToComment);
                  }
                }}
              />
              <button
                onClick={() => addComment(replyToComment)}
                className="w-[104px] h-12 bg-[#5357b6] rounded-lg text-white cursor-pointer hover:bg-[#5356b69f]"
              >
                Reply
              </button>
            </div>
          )}
          {renderComments(comment.id)}
        </div>
      ));
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start py-8 px-4">
      <div className="w-full max-w-[730px] rounded-lg space-y-6">
        <div className="space-y-4">{renderComments()}</div>
        <div className="w-full flex bg-white rounded-md shadow-2xl space-x-4 p-4">
          <img
            src={suxoImage}
            alt="suxo"
            className="w-13 h-10 rounded-full mt-1"
          />
          <textarea
            className="w-full h-24 border p-4 rounded-lg resize-none"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a new comment..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                addComment();
              }
            }}
          />
          <button
            onClick={() => addComment()}
            className="w-[104px] h-12 bg-[#5357b6] rounded-lg text-white cursor-pointer hover:bg-[#5356b69f]"
          >
            Send
          </button>
        </div>
      </div>
      {confirmDelete && (
        <div className="fixed inset-0 bg-[#000000b5] flex justify-center items-center">
          <div className="bg-white flex flex-col gap-5 p-6 rounded-lg shadow-lg">
            <h1 className="text-[#334253] text-3xl font-normal text-center">
              Delete comment
            </h1>
            <p className="w-[336px] text-[#67727e] text-base font-normal leading-normal">
              Are you sure you want to delete this <br /> comment? This will
              remove the comment <br /> and can't be undone.
            </p>
            <div className="flex justify-between space-x-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="w-[161px] h-12 bg-[#67727e] rounded-lg text-white cursor-pointer hover:opacity-75"
              >
                No, Cancel
              </button>
              <button
                onClick={() => {
                  deleteComment(confirmDelete);
                  setConfirmDelete(null);
                }}
                className="w-[161px] h-12 bg-red-500 text-white cursor-pointer hover:opacity-75 rounded-lg"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentSection;
