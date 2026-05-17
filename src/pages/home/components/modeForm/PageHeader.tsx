import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  submitLabel: string;
  onSubmit: () => void;
}

const PageHeader = ({ title, submitLabel, onSubmit }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="flex flex-row justify-between py-3 px-4">
      <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
        {'<'}
      </button>
      <h1>{title}</h1>
      <button type="button" onClick={onSubmit}>{submitLabel}</button>
    </header>
  );
};

export default PageHeader;
