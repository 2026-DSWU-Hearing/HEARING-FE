interface ConversationEndButtonProps {
  onClick: () => void;
}

const ConversationEndButton = ({ onClick }: ConversationEndButtonProps) => {
  return <button type="button" onClick={onClick}></button>;
};

export default ConversationEndButton;
