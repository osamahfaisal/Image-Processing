import cv2
import numpy as np
import os





class functions:

    def margeImages(option,edges1,edges2, uniform_phase,uniformMagnitude):

        image1 = ImageProcess(edges1,(option == "option1"),1,uniform_phase,uniformMagnitude)
        image2 = ImageProcess(edges2,(option != "option1"),2,uniform_phase,uniformMagnitude)
        image_1_fft =image1.fourierTrans()
        image_2_fft =image2.fourierTrans()
        shape = image1.img.shape
        marge_magnitude_phase= np.multiply(image_1_fft,image_2_fft)
        inverseShift=np.fft.ifftshift(marge_magnitude_phase)
        image_Marge=np.real(np.fft.ifft2(inverseShift))
        os.remove("static/images/output/LPFRR.png")
        pathOFResult= f"static/images/output/LPFRR.png"
        cv2.imwrite(pathOFResult,image_Marge)

        
        return pathOFResult,shape
  



    def saveOrgin(original_1 , original_2):
            file_name1 = './static/images/input/original1.png'
            file_name2 = './static/images/input/original2.png'
            with open(file_name1, 'wb') as f:
                f.write(original_1)
            with open(file_name2, 'wb') as f:
                f.write(original_2)




class ImageProcess:
   
    def __init__(self,edges,value,num,uniform_phase_bool,uniform_Magnitude_bool):
        self.edges = edges
        self.value = int(value)
        self.path=f"static/images/input/original{num}.png"
        self.img = cv2.imread(self.path,cv2.IMREAD_GRAYSCALE)
        self.num = num
        self.uniform_phase_bool = uniform_phase_bool
        self.uniform_Magnitude_bool = uniform_Magnitude_bool
        
        
    def update(self,array_2d):
        (w,h)=self.img.shape
        half_w, half_h = int(w/2), int(h/2)
        n = int(min(half_h/15,half_w/15))

     

        if((half_h-n>=self.edges[0][0])and(half_h+n+1<=self.edges[0][1]))or((half_w-n>=self.edges[1][0])and(half_w+n+1<=self.edges[1][1]))or((half_h-n<=self.edges[0][0])and(half_h+n+1>=self.edges[0][1]))or((half_w-n<=self.edges[1][0])and(half_w+n+1>=self.edges[1][1])):
        
            for i in range(array_2d.shape[0]):
                for j in range(array_2d.shape[1]):
                    if (i < self.edges[0][0] or i>=self.edges[0][1] )or (j<=self.edges[1][0] or j >=self.edges[1][1] ): #the i and j axis are obtined according to the cropped image
                        array_2d[i][j]=self.value

        else:
            # high pass filter 

            
                        
            if self.value == 1 and self.uniform_Magnitude_bool=="false":
                array_2d[half_w-n:half_w+n+1,half_h-n:half_h+n+1] = self.value

            if self.value == 0 and self.uniform_phase_bool == 'false':
                array_2d[half_w-n:half_w+n+1,half_h-n:half_h+n+1] = self.value
             #  end high pass filter 


        return array_2d





    def fourierTrans(self):
        fourierImage=np.fft.fft2((self.img).astype(float))           
        fourierImage_shifted = np.fft.fftshift(fourierImage) 

# the magnitude   of image after do fft 
# uniform magnitude 
        if self.value == 1:
            if self.uniform_Magnitude_bool=="true":
                magnitude_or_phase_of_image = np.ones(self.img.shape)
                for i in range(self.img.shape[0]):
                    for j in range(self.img.shape[1]):
                        magnitude_or_phase_of_image[i][j]=int(12000)

#  end uniform magnitude
              

            else:
                magnitude_or_phase_of_image=np.abs(fourierImage_shifted) 
                magnitude_or_phase_of_image  = self.update(magnitude_or_phase_of_image)
    

#  phase of image after fft 
        elif self.value == 0:
            
            magnitude_or_phase_of_image=np.angle(fourierImage_shifted)

            if self.uniform_phase_bool == 'true':
              
            #    put the phase in the uniform 
                magnitude_or_phase_of_image = np.zeros(self.img.shape)
                magnitude_or_phase_of_image = np.exp(1j*magnitude_or_phase_of_image) 


            else:
                magnitude_or_phase_of_image  = self.update(magnitude_or_phase_of_image)
                magnitude_or_phase_of_image = np.exp(1j*magnitude_or_phase_of_image)
            
        return magnitude_or_phase_of_image 





    
