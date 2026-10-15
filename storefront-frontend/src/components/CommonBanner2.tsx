import Link from 'next/link';
interface texttype {
  mainText: string;
  parentText: string;
  currentText: string;
}

const CommonBanner2 = ({ mainText, parentText, currentText }: texttype) => {
  return (
    <div className="">
      <ul className="banner-path">
        <li className="banner-parent-text">
          <Link href="/"> {parentText}</Link>
        </li>
        <span>&gt;</span>
        <li className="banner-current-text">{currentText}</li>
      </ul>
    </div>
  );
};

export default CommonBanner2;
