const SectionHeader = (props) => {
  const { title = "", subTitle = "", customeclass = "" } = props;
  return (
    <div className={`${customeclass ? "title title-2 text-lg-start text-md-center" : "title title-2 text-center"}`}>
      <h2>{title}</h2>
      <h5 className="text-color">{subTitle}</h5>
    </div>
  );
};
export default SectionHeader;
