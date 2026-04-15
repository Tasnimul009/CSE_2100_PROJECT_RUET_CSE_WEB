import FacilityPage from "../../components/facilities/FacilityPage"
import { FACILITIES } from "../../constants/facilitiesData"

const Classroom = () => {
  const facility = FACILITIES.find((item) => item.id === "classroom")
  return <FacilityPage facility={facility} activeTo="/facilities/classroom" />
}

export default Classroom
