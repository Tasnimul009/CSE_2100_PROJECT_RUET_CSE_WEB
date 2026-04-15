import FacilityPage from "../../components/facilities/FacilityPage"
import { FACILITIES } from "../../constants/facilitiesData"

const SeminarRoom = () => {
  const facility = FACILITIES.find((item) => item.id === "seminar-room")
  return <FacilityPage facility={facility} activeTo="/facilities/seminar-room" />
}

export default SeminarRoom
