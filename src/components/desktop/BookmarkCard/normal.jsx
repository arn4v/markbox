import { useDispatch, useSelector } from "react-redux";
import format from "date-fns/format";
import { actions } from "~/store";
import { TagBadge } from "~/components/tag-badge";

/**
 * @param {Object} props
 * @param {string} props.id
 */
export default function Normal(props) {
  const data = useSelector((state) => state.bookmarks[props.id]);
  const dispatch = useDispatch();
  const edit = () => dispatch({ type: actions.EDIT_SHOW });

  return (
    <>
      <div className="flex items-center justify-between w-full p-3 rounded-lg bg-blueGray-700">
        <div className="flex flex-col items-start justify-center w-5/6 gap-1">
          <span className="text-xs text-white">
            {/* {format(data?.created, "do MMMM, yyyy")} */}
          </span>
          <div className="w-5/6 text-sm font-medium text-white break-words">
            {data?.title}
          </div>
          <a
            href={data?.url}
            target="_blank"
            rel="noreferrer"
            className="w-3/4 text-xs text-gray-400 truncate whitespace-nowrap">
            {data?.url}
          </a>
          <div className="flex gap-2 mt-1.5">
            {Object.values(data?.tags).map((item) => {
              return (
                <TagBadge
                  key={item.id}
                  title={item.title}
                  className={item.color}
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col items-end w-1/6 gap-3">
          <a
            target="_blank"
            rel="noreferrer"
            href={data.url}
            className="focus:outline-none">
            <svg
              width="14"
              height="14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M13 1L5.5 8.5m0-6h-3A1.5 1.5 0 001 4v7.5A1.5 1.5 0 002.5 13H10a1.5 1.5 0 001.5-1.5v-3l-6-6zm3-1.5H13 8.5zM13 1v4.5V1z"
                stroke="#EDF2F7"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <button type="button" onClick={edit} className="focus:outline-none">
            <svg
              width="18"
              height="19"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0)">
                <path
                  d="M12.422 4.606l2.941 2.941-2.94-2.94zM13.67 3.36a2.08 2.08 0 012.94 2.94L5.16 17.75H2.25v-2.97L13.67 3.36v0z"
                  stroke="#EDF2F7"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0">
                  <path
                    fill="#fff"
                    transform="translate(0 .5)"
                    d="M0 0h18v18H0z"
                  />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
