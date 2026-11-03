interface QueryErrorStatePropTypes {
  message: string;
  isRetrying?: boolean;
  onRetry: () => void;
}

const QueryErrorState = ({
  message,
  isRetrying = false,
  onRetry,
}: QueryErrorStatePropTypes) => {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-sm px-base py-lg text-center"
    >
      <p className="body-base-medium text-primary">{message}</p>
      <p className="body-sm-regular text-secondary">
        연결 상태를 확인하고 잠시 후 다시 시도해 주세요.
      </p>
      <button
        type="button"
        onClick={onRetry}
        disabled={isRetrying}
        className="body-sm-medium rounded-lg border border-neutral-600 px-base py-sm text-primary disabled:cursor-wait disabled:text-disabled"
      >
        {isRetrying ? '다시 불러오는 중...' : '다시 시도'}
      </button>
    </div>
  );
};

export default QueryErrorState;
