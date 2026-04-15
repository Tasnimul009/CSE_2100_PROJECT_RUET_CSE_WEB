import FacilityPage from "../../components/facilities/FacilityPage"
import { FACILITIES } from "../../constants/facilitiesData"

const Labs = () => {
  const facility = FACILITIES.find((item) => item.id === "labs")
  return <FacilityPage facility={facility} activeTo="/facilities/labs" />
}

export default Labs
