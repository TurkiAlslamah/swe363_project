import bookImage from "../../assets/images/book.svg";
import { motion } from "framer-motion";

export default function Home() {
return (
    <section className="bg-light py-5">
      <div className="container py-5">
        <div className="row align-items-center">
              
          <div className="col-lg-6">
            <div className="text-center mt-5">
            <motion.img   // use motion.img for animation
              src={bookImage}
              alt="Book"
              className="img-fluid"
              style={{ maxWidth: "400px" }}
              animate={{
                y: [0, -10, 0], // up and down
                rotate: [0, 1, -1, 0], // small rotation
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            </div>
          </div>
          
          {/* Right Column - Text Content (Arabic RTL) */}
          <div className="col-lg-6 text-end mb-4 mb-lg-0">
            <h1 className="display-2 fw-bold mb-3" style={{
              color: "#4B0082"
            }}>
              اختبر قدراتك وابدأ
               رحلتك نحو التفوق
            </h1>
         
            <p className="lead text-dark mb-4">
              منصة تعليمية ذكية تجمع بين التكنولوجيا المتقدمة والمحتوى التعليمي
              المميز لتحقيق أفضل النتائج في اختبار القدرات
            </p>
          
          </div>
          
    
          
        </div>
      </div>
    </section>
  );
};
