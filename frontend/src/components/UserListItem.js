import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { useSelector } from "react-redux";
import { MDBTypography } from 'mdb-react-ui-kit';

const UserListItem = ({ user, handleFunction }) => {
    //   const user = useSelector(state => state.user);

    return (
        <MDBTypography note noteColor='warning' className='mt-2 mb-2'>
            <Box
                onClick={handleFunction}
                cursor="pointer"
                // bg="#E8E8E8"
                _hover={{
                    background: "#ffa900",
                    color: "white",
                }}
                w="100%"
                d="flex"
                alignItems="center"
                color="black"
                px={3}
                py={2}
                mb={2}
                borderRadius="lg"
            >

                <Avatar
                    mr={2}
                    size="sm"
                    cursor="pointer"
                    name={user.name}
                    src={user.pic}
                    className="mr-3"
                />
                <Box>

                    <Text>{user.name}</Text>
                    <Text fontSize="xs">
                        <b>Email : </b>
                        {user.email}
                    </Text>


                </Box>
            </Box>
        </MDBTypography>
    );
};

export default UserListItem;