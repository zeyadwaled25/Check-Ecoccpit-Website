import "./Footer.css"
import ImagePolice from "../../public/images/police.png"

function Footer () {
  return (

    <footer className="footer-copyright text-center">
      <a target="_blank" href="https://beian.miit.gov.cn">
        京ICP备2023034719号-3
      </a>{" "}
      &nbsp;&nbsp;&nbsp;&nbsp;
      <a
        target="_blank"
        href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010202010900"
      >
        <img src={ImagePolice} alt="police..." className="me-1" />
        京公网安备 11010202010900号
      </a>{" "}
      &nbsp;&nbsp;&nbsp;&nbsp; 中国国际贸易促进委员会 版权所有
      &nbsp;&nbsp;&nbsp;&nbsp; 南京擎天全税通信息科技有限公司 技术支持
    </footer>
    
  )
}

export default Footer;