import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  submitLabel: string;
}

const PageHeader = ({ title, submitLabel }: PageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header>
      <button type="button" onClick={() => navigate(-1)} aria-label="뒤로가기">
        {'<'}
      </button>
      <h1>{title}</h1>
      <button type="button">{submitLabel}</button>
    </header>
  );
};

export default PageHeader;
