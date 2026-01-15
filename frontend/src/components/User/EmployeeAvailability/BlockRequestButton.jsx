import { Button } from '@mantine/core';

const BlockRequestButton = () => {
  return (
    <div className="flex place-content-around">
      <Button type="submit" className="bg-[#228be6]" radius="md" size="xl">
        Submit block request
      </Button>
    </div>
  );
};

export default BlockRequestButton;
