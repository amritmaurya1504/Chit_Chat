import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";
import { Avatar, Tooltip } from '@chakra-ui/react'

const UserBadgeItem = ({ user, handleFunction, admin }) => {
    return (
        <Tooltip label={user.name} hasArrow placement="bottom-end" bg='rgb(56, 90, 100)'>
            <Badge
                px={2}
                py={1}
                borderRadius="lg"
                m={1}
                mb={2}
                variant="solid"
                fontSize={12}
                colorScheme="yellow"
                cursor="pointer"
                onClick={handleFunction}
            >

                {/* <Avatar size="sm" cursor="pointer" name={user && user.name} src={user && user.pic} /> */}
                {user.name}
                {admin === user._id && <span> (Admin)</span>}
                <CloseIcon pl={1} />
            </Badge>
        </Tooltip>
    );
};

export default UserBadgeItem;