import FacilityPage from "../../components/facilities/FacilityPage"
import { FACILITIES } from "../../constants/facilitiesData"

const Library = () => {
  const facility = FACILITIES.find((item) => item.id === "library")
  return <FacilityPage facility={facility} activeTo="/facilities/library" />
}

export default Library
