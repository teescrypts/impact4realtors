const HourGlass = (props: { [key: string]: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      enableBackground="new 0 0 24 24"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="currentColor"
      {...props}
    >
      <g>
        <rect fill="none" height="24" width="24" />
      </g>
      <g>
        <path d="M18,22l-0.01-6L14,12l3.99-4.01L18,2H6v6l4,4l-4,3.99V22H18z M8,7.5V4h8v3.5l-4,4L8,7.5z" />
      </g>
    </svg>
  );
};

export default HourGlass;
